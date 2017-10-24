using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BorgCivil.Framework.Entities
{
    [Table("StatusLookup")]
    public partial class StatusLookup
    {
        [Key]
        public Guid StatusLookupId { get; set; }

        public Guid? CompanyId { get; set; }

        [StringLength(20)]
        [Column(TypeName = "NVARCHAR")]
        public string Title { get; set; }

        [StringLength(20)]
        [Column(TypeName = "NVARCHAR")]
        public string Group { get; set; }

        [Required]
        public bool IsActive { get; set; }

        public Guid? CreatedBy { get; set; }

        public Guid? EditedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? EditedDate { get; set; }

        public virtual Companies Companies { get; set; }

        public virtual ICollection<Booking> Bookings { get; set; }

        public virtual ICollection<BookingFleets> BookingFleets { get; set; }

        public virtual ICollection<Employee> Employees { get; set; }

        public virtual ICollection<FleetHistory> FleetHistorys { get; set; }

        public virtual ICollection<Drivers> Drivers { get; set; }
    }
}
