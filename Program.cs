using System.ComponentModel.Design;
using DocsVision.BackOffice.CardLib.CardDefs;
using DocsVision.BackOffice.ObjectModel;
using DocsVision.BackOffice.ObjectModel.Services;
using DocsVision.Platform.ObjectManager;
using DocsVision.Platform.ObjectModel;
using DocsVision.Platform.ObjectModel.Search;
using DocumentFormat.OpenXml.Office.CustomUI;

namespace IntroductionToSDK {
	internal class Program {
		public static void Main(string[] args) {
			var serverURL = System.Configuration.ConfigurationManager.AppSettings["DVUrl"];
			var username = System.Configuration.ConfigurationManager.AppSettings["Username"];
			var password = System.Configuration.ConfigurationManager.AppSettings["Password"];

			var sessionManager = SessionManager.CreateInstance();
			sessionManager.Connect(serverURL, String.Empty, username, password);

			UserSession? session = null;
			try {
				session = sessionManager.CreateSession();
				var context = CreateContext(session);
				CreateCardBusinessTrip(session, context);
				Console.WriteLine("Press any key to continue...");
				Console.ReadKey();
			} finally {
				session?.Close();
			}
		}

		public static ObjectContext CreateContext(UserSession session) {
			return DocsVision.BackOffice.ObjectModel.ContextFactory.CreateContext(session);
		}

		static void ChangeCardState(ObjectContext context, Document card, string targetState) {
			IStateService stateSvc = context.GetService<IStateService>();
			var branch = stateSvc.FindLineBranchesByStartState(card.SystemInfo.State)
				.FirstOrDefault(s => s.EndState.DefaultName == targetState);
			stateSvc.ChangeState(card, branch);
		}

		public static void CreateCardBusinessTrip(UserSession session, ObjectContext context) {
			Console.WriteLine($"Session: {session.Id}");

			var documentCardKind = context.GetObject<KindsCardKind>(new Guid("{8ACE1220-A452-455D-8EEB-9EDF9DC6E327}"));
			var businesstripCardKind = documentCardKind.Kinds.FirstOrDefault(x => (string)x.GetValue("Name") == "Заявка на командировку");
			var docSvc = context.GetService<IDocumentService>();
			var businessTrip = docSvc.CreateDocument(null, businesstripCardKind);

			businessTrip.MainInfo["Name"] = "created from code";
			businessTrip.MainInfo[CardDocument.MainInfo.RegDate] = DateTime.Now;
			businessTrip.MainInfo["NumberOfDaysOfBusinessTrip"] = 123;
			businessTrip.MainInfo["AllowanceAmount"] = 1234;
			businessTrip.MainInfo["Tickets"] = 0;
			businessTrip.MainInfo["Reason"] = "reason";
			businessTrip.MainInfo["BuisnessTripStart"] = DateTime.Now;
			businessTrip.MainInfo["BusinessTripEnd"] = DateTime.Now;

			var staffSvc = context.GetService<IStaffService>();
			businessTrip.MainInfo.Author = staffSvc.GetCurrentEmployee();
			businessTrip.MainInfo.Registrar = staffSvc.GetCurrentEmployee();
			businessTrip.MainInfo["arrangingPerson"] = staffSvc.FindEmpoyeeByAccountName("ENGINEER\\ilya_lebedev").GetObjectId();
			businessTrip.MainInfo["coordinatingPerson"] = staffSvc.FindEmpoyeeByAccountName("ENGINEER\\ilya_lebedev").GetObjectId();
			businessTrip.MainInfo["secondedPerson"] = staffSvc.FindEmpoyeeByAccountName("ENGINEER\\ilya_lebedev").GetObjectId();
			businessTrip.MainInfo["supervisor"] = staffSvc.GetEmployeeManager(staffSvc.FindEmpoyeeByAccountName("ENGINEER\\ilya_lebedev")).GetObjectId();
			businessTrip.MainInfo["Phone"] = staffSvc.FindEmpoyeeByAccountName("ENGINEER\\ilya_lebedev").Phone;

			var staffCard = context.GetObject<Staff>(new Guid("{6710B92A-E148-4363-8A6F-1AA0EB18936C}"));
			var depCard = staffCard.Units.FirstOrDefault(x => (string)x.GetValue("Name") == "Микоян");
			businessTrip.MainInfo["ResponsDepartment"] = staffSvc.GetDepartment(depCard.Units[0].GetObjectId()).GetObjectId();

			var baseUSvc = context.GetService<IBaseUniversalService>();
			businessTrip.MainInfo["city"] = baseUSvc.FindItemWithSameName("Сургут", context.GetObject<BaseUniversalItemType>(new Guid("{2EF8FC87-D4F4-49E5-A87E-9777A7598157}"))).GetObjectId();

			context.AcceptChanges();

			docSvc.AddMainFile(businessTrip, @"F:\Downloads\DigDes.EngineerSchool.IntroductionToSDK\Screenshot 2024-05-19 112740.png");
			ChangeCardState(context, businessTrip, "onApproval");
			context.AcceptChanges();

			Console.WriteLine($"New card id: {businessTrip.GetObjectId()}");
		}
	}
}
