/**
 * Created by wanpeng on 2017/2/17.
 */
import {createAction} from 'redux-actions'
import * as publishActionTypes from '../constants/publishActionTypes'
import * as uiTypes from '../constants/uiActionTypes'
import * as lcPublish from '../api/leancloud/publish'
import {getInputFormData, isInputFormValid} from '../selector/inputFormSelector'
import {notifyPublishComment} from './messageAction'

export const PUBLISH_FORM_SUBMIT_TYPE = {
  PUBLISH_SERVICE: 'PUBLISH_SERVICE',
  PUBLISH_HELP: 'PUBLISH_HELP',
  UPDATE_SERVICE: 'UPDATE_SERVICE',
  UPDATE_HELP: 'UPDATE_HELP',
  PUBLISH_COMMENT: 'PUBLISH_COMMENT',
}

export function publishFormData(payload) {
  return (dispatch, getState) => {
    let formData = undefined
    if (payload.formKey) {
      let formCheck = createAction(uiTypes.INPUTFORM_VALID_CHECK)
      dispatch(formCheck({formKey: payload.formKey}))
      let isFormValid = isInputFormValid(getState(), payload.formKey)
      if (isFormValid && !isFormValid.isValid) {
        if (payload.error) {
          payload.error({message: isFormValid.errMsg})
        }
        return
      }
      formData = getInputFormData(getState(), payload.formKey)
    }
    switch (payload.submitType) {
      case PUBLISH_FORM_SUBMIT_TYPE.PUBLISH_SERVICE:
        dispatch(handlePublishService(payload, formData))
        break
      case PUBLISH_FORM_SUBMIT_TYPE.PUBLISH_HELP:
        dispatch(handlePublishHelp(payload, formData))
        break
      case PUBLISH_FORM_SUBMIT_TYPE.UPDATE_SERVICE:
        dispatch(handleUpdateService(payload, formData))
        break
      case PUBLISH_FORM_SUBMIT_TYPE.UPDATE_HELP:
        dispatch(handleUpdateHelp(payload, formData))
        break
      case PUBLISH_FORM_SUBMIT_TYPE.PUBLISH_COMMENT:
        dispatch(handlePublishComment(payload, formData))
        break
      default:
        break
    }
  }
}

function handlePublishService(payload, formData) {
  return (dispatch, getState) => {
    let publishServicePayload = {
      title: formData.serviceName.text,
      content: JSON.stringify(formData.serviceContent.text),
      imgGroup: payload.images,
      price: formData.servicePrice.text,
      userId: payload.userId
    }
    lcPublish.publishService(publishServicePayload).then((result) => {
      if (payload.success) {
        payload.success()
      }
      let publishAction = createAction(publishActionTypes.ADD_PUBLISH)
      dispatch(publishAction({publish: result}))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

function handlePublishHelp(payload, formData) {
  return (dispatch, getState) => {
    let publishHelpPayload = {
      title: formData.serviceName.text,
      content: JSON.stringify(formData.serviceContent.text),
      imgGroup: payload.images,
      price: formData.servicePrice.text,
      userId: payload.userId
    }
    lcPublish.publishHelp(publishHelpPayload).then((result) => {
      if (payload.success) {
        payload.success()
      }
      let publishAction = createAction(publishActionTypes.ADD_PUBLISH)
      dispatch(publishAction({publish: result}))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

function handleUpdateService(payload, formData) {
  return (dispatch, getState) => {
    let updateServicePayload = {
      title: formData.serviceName.text,
      content: JSON.stringify(formData.serviceContent.text),
      imgGroup: payload.images,
      price: formData.servicePrice.text,
      publishId: payload.publishId,
    }

    lcPublish.updateService(updateServicePayload).then((result) => {
      if (payload.success) {
        payload.success()
      }
      let publishAction = createAction(publishActionTypes.UPDATE_PUBLISH)
      dispatch(publishAction({publish: result}))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

function handleUpdateHelp(payload, formData) {
  return (dispatch, getState) => {

  }
}

function handlePublishComment(payload, formData) {
  return (dispatch, getState) => {
    let publishCommentPayload = {
      content: payload.content,
      publishId: payload.publishId,
      commentId: payload.commentId,
      userId: payload.userId
    }
    if ( (!payload.content) || payload.content.length == 0) {
      payload.error({message: "输入不能为空"})
      return
    }
    lcPublish.publishComments(publishCommentPayload).then((result) => {
      console.log("lcPublish.publishComments return", result)
      if (payload.success) {
        payload.success()
      }
      let publishCommentAction = createAction(publishActionTypes.PUBLISH_COMMENT_SUCCESS)
      dispatch(publishCommentAction({publishId:payload.publishId, publishComment:result, stateKey: payload.stateKey}))
      let publishCommentCntPlusActoion = createAction(publishActionTypes.PUBLISH_UPDATE_COMMENTCNT)
      dispatch(publishCommentCntPlusActoion({publishId: payload.publishId}))
      dispatch(notifyPublishComment({
        publishId: payload.publishId,
        replyTo: payload.replyTo,
        commentId: result.objectId,
        content: payload.content
      }))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchPublishesByUserId(payload) {
  return (dispatch, getState) => {
    let publishesPayload = {
      userId: payload.userId,
    }

    lcPublish.getPublishedByUserId(publishesPayload).then((result) => {
      if (payload.success) {
        payload.success()
      }
      let publishesUpdateAction = createAction(publishActionTypes.UPDATE_PUBLISHES)
      dispatch(publishesUpdateAction({pubishes: result}))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchPublishes(payload) {
  return (dispatch, getState) => {
    lcPublish.fetchPublishes(payload).then((result) => {
      let publishFetchAction = createAction(publishActionTypes.FETCH_PUBLISHES)
      dispatch(publishFetchAction({pubishes: result, type: payload.type, isPaging: !payload.isRefresh}))
      if(payload.success) {
        payload.success(result.size==0)
      }
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })

  }
}

export function fetchPublishCommentByPublishId(payload) {
  return (dispatch, getState) => {
    lcPublish.getPublishComments(payload).then((result) => {
      let updatePublishCommentsAction = createAction(publishActionTypes.UPDATE_PUBLISH_COMMENTS)
      dispatch(updatePublishCommentsAction({publishId:payload.publishId, publishComments: result}))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }

}

export function updatePublishStatus(payload) {
  return (dispatch, getState) => {
    lcPublish.updatePublishStatus(payload).then((result) => {
      console.log("lcPublish.updatePublishStatus ", result)
      let updatePublishStatusAction = createAction(publishActionTypes.UPDATE_PUBLISH_STATUS)
      dispatch(updatePublishStatusAction({status: payload.status, publishId: payload.publishId}))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}

export function updatePublishRefreshTime(payload) {
  return (dispatch, getState) => {
    lcPublish.updateRefreshTime(payload).then((result) => {
      let updatePublishRefreshTime = createAction(publishActionTypes.UPDATE_PUBLISH_REFRESHTIME)
      dispatch(updatePublishRefreshTime({publishId: payload.publishId, refreshTime: payload.refreshTime}))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }

}
