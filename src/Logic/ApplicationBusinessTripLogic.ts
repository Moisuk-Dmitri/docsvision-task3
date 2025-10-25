import { ILayout } from "@docsvision/webclient/System/$Layout";
import { DirectoryDesignerRow } from "@docsvision/webclient/BackOffice/DirectoryDesignerRow";
import { GenModels } from "@docsvision/webclient/Generated/DocsVision.WebClient.Models";
import { $MessageBox } from "@docsvision/webclient/System/$MessageBox";
import { NumberControl } from "@docsvision/webclient/Platform/Number";
import { $DepartmentController, $DirectoryDesignerRowController, $EmployeeController } from "@docsvision/webclient/Generated/DocsVision.WebClient.Controllers";
import { MessageBox } from "@docsvision/webclient/Helpers/MessageBox/MessageBox";
import { StaffDirectoryItems } from "@docsvision/webclient/BackOffice/StaffDirectoryItems";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { Control } from "@docsvision/webclient/Legacy/Control";
import { TextBox } from "@docsvision/webclient/Platform/TextBox";
import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";


export class ApplicationBusinessTripLogic {
    public async supervisorCheckConfirmed(layout: ILayout): Promise<boolean> {
        const staffCtrl = layout.controls.tryGet<StaffDirectoryItems>("coordinatingPerson");
        if (staffCtrl.params.value == null) {
            await layout.getService($MessageBox).showError('Поле Согласующий пустое!');
            return false;
        }

        return true;
    }

    public async updateStartDateByEndDate(startDateCtrl: DateTimePicker) {
        const layout = startDateCtrl.layout;
        const endDateCtrl = layout.controls.tryGet<DateTimePicker>("endDate");

        if (startDateCtrl.params.value >= endDateCtrl.params.value && endDateCtrl.params.value != null) {
            startDateCtrl.params.value = null;
        }
    }

    public async updateEndDateByStartDate(endDateCtrl: DateTimePicker) {
        const layout = endDateCtrl.layout;
        const startDateCtrl = layout.controls.tryGet<DateTimePicker>("startDate");

        if (endDateCtrl.params.value <= startDateCtrl.params.value && startDateCtrl.params.value != null) {
            endDateCtrl.params.value = null;
        }
    }

    public async printMainInfo(buttonCtrl: CustomButton) {
        let layout = buttonCtrl.layout;

        let cityId = layout.controls.tryGet<DirectoryDesignerRow>("cityRow").params.value.id;
        let cityName: string;
        const url = `http://dvappserver.engineer.school:5004/api/v1/cards/4538149D-1FC7-4D41-A104-890342C6B4F8/1b1a44fb-1fb1-4876-83aa-95ad38907e24/${cityId}`;
        await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                const nameField = data.data.fields.find((field: any) => field.alias === "Name");
                cityName = nameField ? nameField.value : null;
            })
            .catch(error => console.error('Error: fetch cityName was not completed', error));

        let name = layout.controls.tryGet<TextBox>("titleTextBox");
        let dateOfCreation = layout.controls.tryGet<DateTimePicker>("date");
        let startDate = layout.controls.tryGet<DateTimePicker>("startDate");
        let endDate = layout.controls.tryGet<DateTimePicker>("endDate");
        let tripReason = layout.controls.tryGet<TextBox>("reason");

        if (!name.params.value ||
            dateOfCreation.params.value == null ||
            startDate.params.value == null ||
            endDate.params.value == null ||
            !tripReason.params.value ||
            !cityName
        ) {
            await layout.getService($MessageBox).showError('Информация не заполнена!');
            return;
            }

        await layout.getService($MessageBox).showInfo(
            'Имя: ' + name.params.value + '\n' +
            'Дата создания: ' + dateOfCreation.params.value.toLocaleDateString('ru-RU') + '\n' +
            'Дата с: ' + startDate.params.value.toLocaleDateString('ru-RU') + '\n' +
            'Дата по: ' + endDate.params.value.toLocaleDateString('ru-RU') + '\n' +
            'Основание для поездки: ' + tripReason.params.value + '\n' +
            'Название города: ' + cityName
        );
    }
}