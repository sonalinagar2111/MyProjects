using BorgCivil.Framework.Entities;
using BorgCivil.Utils.Models;
using System;
using System.Collections.Generic;

namespace BorgCivil.Service
{
    public interface IDriversService : IService
    {
        List<Drivers> GetAllDriver();
        List<SelectListModel> GetDriversList(Guid FleetRegistrationId);
        Drivers GetDriverByDriverId(Guid DriverId);
        string AddDriver(DriverDataModel DriverDataModel);
        string UpdateDriver(DriverDataModel DriverDataModel);
        bool UpdateDocumentId(Guid DriverId, Guid DocumentId);
        bool UpdateDocumentLicenseId(Guid DriverId, string DocumentId);
        bool DeleteDriver(Guid DriverId);

    }
}
