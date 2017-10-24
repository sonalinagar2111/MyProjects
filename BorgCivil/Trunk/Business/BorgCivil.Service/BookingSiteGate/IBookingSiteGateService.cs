using BorgCivil.Framework.Entities;
using BorgCivil.Utils.Models;
using System;
using System.Collections.Generic;

namespace BorgCivil.Service
{
    public interface IBookingSiteGateService : IService
    {
        List<BookingSiteGates> GetAllBookingSiteGate();
        BookingSiteGates GetBookingSiteGateByBookingSiteGateId(Guid BookingSiteGateId);
        BookingSiteGates GetBookingSiteGateByGateId(Guid GateId);
        List<BookingSiteGates> GetBookingSiteGateByBookingId(Guid BookingId);
        bool AddBookingSiteGate(BookingSiteDetailDataModel BookingSiteDetailDataModel);
        bool UpdateBookingSiteGate(BookingSiteDetailDataModel BookingSiteDetailDataModel);
        bool DeleteBookingSiteGate(Guid GateId);
        bool DeleteBookingSiteGateByBookingId(Guid BookingId);
    }
}
