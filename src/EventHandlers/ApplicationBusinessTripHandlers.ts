import { ILayout } from "@docsvision/webclient/System/$Layout";
import { CancelableEventArgs } from "@docsvision/webclient/System/CancelableEventArgs";
import { ICardSavingEventArgs } from "@docsvision/webclient/System/ICardSavingEventArgs";
import { Layout } from "@docsvision/webclient/System/Layout";
import { ApplicationBusinessTripLogic } from "../Logic/ApplicationBusinessTripLogic";
import { DirectoryDesignerRow } from "@docsvision/webclient/BackOffice/DirectoryDesignerRow";
import { GenModels } from "@docsvision/webclient/Generated/DocsVision.WebClient.Models";
import { IDataChangedEventArgs, IDataChangedEventArgsEx } from "@docsvision/webclient/System/IDataChangedEventArgs";
import { StaffDirectoryItems } from "@docsvision/webclient/BackOffice/StaffDirectoryItems";
import { CancelableEvent } from "@docsvision/webclient/System/CancelableEvent";
import { arg } from "@docsvision/webclient/System/Decorators";
import { DateTimePicker } from "@docsvision/webclient/Platform/DateTimePicker";
import { CustomButton } from "@docsvision/webclient/Platform/CustomButton";

/**
 * Событие во время сохранения карточки
 * @param layout разметка
 * @param args аргументы
 */
export async function ddApplicationBusinessTrip_cardSaving(layout: ILayout, args: CancelableEventArgs<ICardSavingEventArgs>) {
    if (!layout) { return; }
    let logic = new ApplicationBusinessTripLogic();

    args.wait();
    if (!await logic.supervisorCheckConfirmed(layout)) {
        args.cancel();
        return;
    }

    args.accept();
}

/**
 * Событие во время сохранения карточки
 * @param sender контрол
 * @param args аргументы
 */
export async function ddApplicationBusinessTrip_onDataChanged(sender: DateTimePicker, args: IDataChangedEventArgsEx<GenModels.DateTimePickerType>) {
    if (!sender) { return; }
    let logic = new ApplicationBusinessTripLogic();

    if (sender.params.name == "startDate") { await logic.updateStartDateByEndDate(sender); }
    if (sender.params.name == "endDate") { await logic.updateEndDateByStartDate(sender); }
}

/**
* Событие во время сохранения карточки
* @param sender разметка
*/
export async function ddApplicationBusinessTrip_OnClick(sender: CustomButton) {
    if (!sender) { return; }
    let logic = new ApplicationBusinessTripLogic();
    await logic.printMainInfo(sender);
}