using BorgCivil.Framework.Entities;
using BorgCivil.Repositories;
using BorgCivil.Utils.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BorgCivil.Service
{
    public class FleetTypesService : IFleetTypesService
    {
        #region Dependencies Injection with initialization

        //Initialized interface object. 
        IUnitOfWork unitOfWork;

        //Initialized Parameterized Constructor.
        public FleetTypesService(IUnitOfWork _unitOfWork) { unitOfWork = _unitOfWork; }

        #endregion

        #region FleetTypesServices

        /// <summary>
        /// getting all Fleet from FleetTypes table
        /// </summary>
        /// <returns></returns>
        public List<FleetTypes> GetAllFleetTypes()
        {
            try
            {
                return unitOfWork.FleetTypesRepository.SearchBy<FleetTypes>(x => x.IsActive == true).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// this method is used for getting fleet detail by FleetTypeId
        /// </summary>
        /// <param name="FleetTypeId"></param>
        /// <returns></returns>
        public FleetTypes GetFleetTypesByFleetTypeId(Guid FleetTypeId)
        {
            try
            {
                //map entity.
                return unitOfWork.FleetTypesRepository.GetById<FleetTypes>(FleetTypeId);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// This method for Get Fleet for select list type controls [Text, Value] pair.
        /// </summary>
        /// <returns>List of Select Value from FleetTypes entity.</returns>
        public List<SelectListModel> GetFleetTypesList()
        {
            try
            {
                ////get all FleetTypes records
                var types = unitOfWork.FleetTypesRepository.GetAll<FleetTypes>().ToList();

                ////check types is null or empity
                if (types != null)
                {
                    ////map entity to model.
                    return types.Select(item => new SelectListModel
                    {
                        Text = item.Fleet,
                        Value = item.FleetTypeId.ToString()
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

        /// <summary>
        /// method to add data in fleetType table
        /// </summary>
        /// <param name="FleetTypeDataModel"></param>
        /// <returns></returns>
        public string AddFleetType(FleetTypeDataModel FleetTypeDataModel)
        {
            try
            {
                // created new guid
                var Id = Guid.NewGuid();

                //map entity.
                FleetTypes entity = new FleetTypes()
                {
                    FleetTypeId = Id,
                    Fleet = FleetTypeDataModel.Fleet,
                    Description = FleetTypeDataModel.Description,
                    IsActive = FleetTypeDataModel.IsActive,
                    CreatedBy = FleetTypeDataModel.CreatedBy != null ? FleetTypeDataModel.CreatedBy : (Guid?)null,
                    EditedBy = FleetTypeDataModel.EditedBy != null ? FleetTypeDataModel.EditedBy : (Guid?)null,
                    CreatedDate = System.DateTime.UtcNow,
                    EditedDate = null
                };
                //add record from in database.
                unitOfWork.FleetTypesRepository.Insert<FleetTypes>(entity);

                ////save changes in database.
                unitOfWork.FleetTypesRepository.Commit();

                return Id.ToString();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// method to update the FleetType table by FleetTypeId
        /// </summary>
        /// <param name="FleetTypeDataModel"></param>
        /// <returns></returns>
        public string UpdateFleetType(FleetTypeDataModel FleetTypeDataModel)
        {
            try
            {
                ////get FleetType data by FleetTypeId.
                var FleetTypeDetail = GetFleetTypesByFleetTypeId(FleetTypeDataModel.FleetTypeId);

                ////case of not null return 
                if (FleetTypeDetail != null)
                {
                    ////map entity.
                    FleetTypeDetail.Fleet = FleetTypeDataModel.Fleet;
                    FleetTypeDetail.Description = FleetTypeDataModel.Description;
                    FleetTypeDetail.EditedDate = System.DateTime.UtcNow;

                    ////update record into database entity.
                    unitOfWork.FleetTypesRepository.Update<FleetTypes>(FleetTypeDetail);

                    ////save changes in database.
                    unitOfWork.FleetTypesRepository.Commit();

                    ////case of update.
                    return FleetTypeDetail.FleetTypeId.ToString();
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
        /// delete FleetType from FleetType table
        /// </summary>
        /// <param name="FleetTypeId"></param>
        /// <returns></returns>
        public bool DeleteFleetType(Guid FleetTypeId)
        {
            try
            {
                ////get FleetType data by FleetTypeId.
                var FleetType = GetFleetTypesByFleetTypeId(FleetTypeId);

                ////case of not null return 
                if (FleetType != null)
                {
                    ////update record into database entity.
                    unitOfWork.FleetTypesRepository.Delete<FleetTypes>(FleetType);

                    ////save changes in database.
                    unitOfWork.FleetTypesRepository.Commit();

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
        /// method to update the documentId in fleetType table by FleetTypeId
        /// </summary>
        /// <param name="FleetTypeId"></param>
        /// <param name="DocumentId"></param>
        /// <returns></returns>
        public bool UpdateDocumentId(Guid FleetTypeId, Guid DocumentId)
        {
            try
            {
                ////get FleetType data by FleetTypeId.
                var FleetTypeDetail = GetFleetTypesByFleetTypeId(FleetTypeId);

                ////case of not null return 
                if (FleetTypeDetail != null)
                {
                    ////map entity.
                    FleetTypeDetail.DocumentId = DocumentId;
                    FleetTypeDetail.EditedDate = System.DateTime.UtcNow;

                    ////update record into database entity.
                    unitOfWork.FleetTypesRepository.Update<FleetTypes>(FleetTypeDetail);

                    ////save changes in database.
                    unitOfWork.FleetTypesRepository.Commit();

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

        #endregion
    }
}
