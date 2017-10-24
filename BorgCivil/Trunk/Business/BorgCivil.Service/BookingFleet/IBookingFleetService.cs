using BorgCivil.Framework.Entities;
using BorgCivil.Utils.Models;
using System;
using System.Collections.Generic;

namespace BorgCivil.Service
{
    public interface IBookingFleetService : IService
    {
        List<BookingFleets> GetAllBookingFleet();
        List<BookingFleets> GetBookingFleetsByBookingId(Guid BookingId);
        BookingFleets GetBookingFleetDetailByBookingFleetId(Guid BookingFleetId);
        List<BookingFleets> GetAllBookingFleetByStatusLookupId(Guid StatusLookupId);
        string AddBookingFleet(BookingFleetDataModel BookingFleetDataModel);
        bool UpdateBookingFleet(BookingFleetDataModel BookingFleetDataModel);
        bool DeleteBookingFleet(Guid BookingFleetId);
        bool UpdateBookingFleetStatus(Guid BookingFleetId, Guid StatusLookUpId);
    }
}
