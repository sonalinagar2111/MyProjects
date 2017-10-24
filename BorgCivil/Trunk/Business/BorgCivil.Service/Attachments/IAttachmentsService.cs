using BorgCivil.Framework.Entities;
using BorgCivil.Utils.Models;
using System;
using System.Collections.Generic;

namespace BorgCivil.Service
{
    public interface IAttachmentsService : IService
    {
        List<Attachments> GetAllAttachment();

        Attachments GetAttachmentById(Guid AttachmentId);   
    }
}
