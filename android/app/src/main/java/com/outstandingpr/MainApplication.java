package com.outstandingpr;

import android.app.Application;

import com.beefe.picker.PickerViewPackage;
import com.facebook.react.ReactApplication;
import com.zachary.reactnative.leancloudsdk.AvOsCloudPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.zachary.reactnative.baidumap.BaiduMapPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AvOsCloudPackage(),
            new RNDeviceInfo(),
            new PickerViewPackage(),
            new ImagePickerPackage(),
            new PickerPackage(),
            new VectorIconsPackage(),
            new BaiduMapPackage(getApplicationContext())
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
