﻿using BorgCivil.Framework.Entities;
using BorgCivil.Repositories;
using BorgCivil.Utils.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BorgCivil.Service
{
    public class AttachmentsService : IAttachmentsService
    {
        #region Dependencies Injection with initialization

        //Initialized interface object. 
        IUnitOfWork unitOfWork;

        //Initialized Parameterized Constructor.
        public AttachmentsService(IUnitOfWork _unitOfWork) { unitOfWork = _unitOfWork; }

        #endregion

        #region AttachmentsService

        /// <summary>
        /// getting all attachement from attachment table
        /// </summary>
        /// <returns></returns>
        public List<Attachments> GetAllAttachment()
        {
            try
            {
                return unitOfWork.AttachmentsRepository.SearchBy<Attachments>(x => x.IsActive == true).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// getting attachement by Id from attachment table
        /// </summary>
        /// <returns></returns>
        public Attachments GetAttachmentById(Guid AttachmentId)
        {
            try
            {
                return unitOfWork.AttachmentsRepository.FindBy<Attachments>(x => x.AttachmentId == AttachmentId);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #endregion
    }
}
