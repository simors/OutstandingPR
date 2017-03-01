/**
 * Created by wanpeng on 2017/2/17.
 */
import {createAction} from 'redux-actions'
import * as publishActionTypes from '../constants/publishActionTypes'
import * as uiTypes from '../constants/uiActionTypes'
import * as lcPublish from '../api/leancloud/publish'
import {getInputFormData, isInputFormValid} from '../selector/inputFormSelector'

export const PUBLISH_FORM_SUBMIT_TYPE = {
  PUBLISH_SERVICE: 'PUBLISH_SERVICE',
  PUBLISH_HELP: 'PUBLISH_HELP',
  UPDATE_SERVICE: 'UPDATE_SERVICE',
  UPDATE_HELP: 'UPDATE_HELP',
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

function handleUpdateHelp(payload, formDate) {
  return (dispatch, getState) => {

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

export function fetchLastPublishes(payload) {
  return (dispatch, getState) => {

    let fetchPayload = {
      type: payload.type,
    }

    lcPublish.fetchLastPublishes(fetchPayload).then((result) => {
      if (payload.success) {
        payload.success()
      }
      let publishFetchAction = createAction(publishActionTypes.FETCH_LAST_PUBLISHES)
      dispatch(publishFetchAction({pubishes: result, type: payload.type}))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })

  }
}
