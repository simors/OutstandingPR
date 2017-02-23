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

  }
}
