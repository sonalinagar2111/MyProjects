using BorgCivil.Framework.Entities;
using BorgCivil.Repositories;
using BorgCivil.Utils.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BorgCivil.Service
{
    public class SitesService : ISitesService
    {
        #region Dependencies Injection with initialization

        //Initialized interface object. 
        IUnitOfWork unitOfWork;

        //Initialized Parameterized Constructor.
        public SitesService(IUnitOfWork _unitOfWork) { unitOfWork = _unitOfWork; }

        #endregion

        #region SitesServices

        /// <summary>
        /// getting all sites from site table
        /// </summary>
        /// <returns></returns>
        public List<Sites> GetAllSites()
        {
            try
            {
                return unitOfWork.SitesRepository.SearchBy<Sites>(x => x.IsActive == true).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// this method is used for getting site detail by siteId
        /// </summary>
        /// <param name="SiteId"></param>
        /// <returns></returns>
        public Sites GetSitesBySiteId(Guid SiteId)
        {
            try
            {
                //map entity.
                return unitOfWork.SitesRepository.GetById<Sites>(SiteId);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// method to add data in site table
        /// </summary>
        /// <param name="SiteDataModel"></param>
        /// <returns></returns>
        public string AddSite(SiteDataModel SiteDataModel)
        {
            try
            {
                // created new guid
                var Id = Guid.NewGuid();

                //map entity.
                Sites entity = new Sites()
                {
                    SiteId = Id,
                    CustomerId = new Guid(SiteDataModel.CustomerId),
                    SiteName = SiteDataModel.SiteName,
                    PoNumber = SiteDataModel.PoNumber,
                    CreditTermAgreed = SiteDataModel.CreditTermAgreed,
                    FuelIncluded = SiteDataModel.FuelIncluded,
                    TollTax = SiteDataModel.TollTax,
                    IsActive = SiteDataModel.IsActive,
                    CreatedBy = SiteDataModel.CreatedBy != null ? SiteDataModel.CreatedBy : (Guid?)null,
                    EditedBy = SiteDataModel.EditedBy != null ? SiteDataModel.EditedBy : (Guid?)null,
                    CreatedDate = System.DateTime.UtcNow,
                };
                //add record from in database.
                unitOfWork.SitesRepository.Insert<Sites>(entity);

                ////save changes in database.
                unitOfWork.SitesRepository.Commit();

                return Id.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// method to update the site tables
        /// </summary>
        /// <param name="SiteDataModel"></param>
        /// <returns></returns>
        public string UpdateSite(SiteDataModel SiteDataModel)
        {
            try
            {
                ////get site data by SiteId.
                var SiteDetail = GetSitesBySiteId(new Guid(SiteDataModel.SiteId));

                ////case of not null return 
                if (SiteDetail != null)
                {
                    ////map entity.
                    SiteDetail.CustomerId = new Guid(SiteDataModel.CustomerId);
                    SiteDetail.SiteName = SiteDataModel.SiteName;
                    SiteDetail.PoNumber = SiteDataModel.PoNumber;
                    SiteDetail.CreditTermAgreed = SiteDataModel.CreditTermAgreed;
                    SiteDetail.FuelIncluded = SiteDataModel.FuelIncluded;
                    SiteDetail.TollTax = SiteDataModel.TollTax;
                    SiteDetail.IsActive = SiteDataModel.IsActive;
                    SiteDetail.CreatedBy = SiteDataModel.CreatedBy != null ? SiteDataModel.CreatedBy : (Guid?)null;
                    SiteDetail.EditedBy = SiteDataModel.EditedBy != null ? SiteDataModel.EditedBy : (Guid?)null;
                    SiteDetail.EditedDate = System.DateTime.UtcNow;

                    ////update record into database entity.
                    unitOfWork.SitesRepository.Update<Sites>(SiteDetail);

                    ////save changes in database.
                    unitOfWork.SitesRepository.Commit();

                    ////case of update.
                    return SiteDetail.SiteId.ToString();
                }
                else
                {
                    ////case of null return null object.
                    return "error";
                }
            }
            catch (Exception ex)
            {
                ////case of error throw
                throw ex;
            }
        }

        /// <summary>
        /// delete site from site table
        /// </summary>
        /// <param name="SiteId"></param>
        /// <returns></returns>
        public bool DeleteSite(Guid SiteId)
        {
            try
            {
                ////get site data by SiteId.
                var Site = GetSitesBySiteId(SiteId);

                ////case of not null return 
                if (Site != null)
                {
                    ////update record into database entity.
                    unitOfWork.SitesRepository.Delete<Sites>(Site);

                    ////save changes in database.
                    unitOfWork.SitesRepository.Commit();

                    ////case of update.
                    return true;
                }
                else
                {
                    ////case of null return null object.
                    return false;
                }
            }
            catch (Exception ex)
            {
                ////case of error throw
                throw ex;
            }
        }

        /// <summary>
        /// method to update the documentId in site table by SiteId
        /// </summary>
        /// <param name="SiteId"></param>
        /// <param name="DocumentId"></param>
        /// <returns></returns>
        public bool UpdateDocumentId(Guid SiteId, Guid DocumentId)
        {
            try
            {
                //get site data by SiteId.
                var SiteDetail = GetSitesBySiteId(SiteId);

                //case of not null return 
                if (SiteDetail != null)
                {
                    //map entity.
                    SiteDetail.DocumentId = DocumentId;
                    SiteDetail.EditedDate = System.DateTime.UtcNow;

                    //update record into database entity.
                    unitOfWork.SitesRepository.Update<Sites>(SiteDetail);

                    //save changes in database.
                    unitOfWork.SitesRepository.Commit();

                    //case of update.
                    return true;
                }
                else
                {
                    //case of null return null object.
                    return false;
                }
            }
            catch (Exception ex)
            {
                //case of error throw
                throw ex;
            }
        }

        /// <summary>
        /// This method for Get Sites for select list type controls [Text, Value] pair.
        /// </summary>
        /// <param name="CustomerId"></param>
        /// <returns>List of Select Value from sites entity.</returns>
        public List<SelectListModel> GetSitesListByCustomerId(Guid CustomerId)
        {
            try
            {
                ////get all sites records
                var types = unitOfWork.SitesRepository.GetAll<Sites>().Where(x => x.CustomerId == CustomerId).ToList();

                ////check types is null or empity
                if (types != null)
                {
                    ////map entity to model.
                    return types.Select(item => new SelectListModel
                    {
                        Text = item.SiteName,
                        Value = item.SiteId.ToString()
                    }
                   ).ToList();
                }
                return new List<SelectListModel>();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion
    }
}
