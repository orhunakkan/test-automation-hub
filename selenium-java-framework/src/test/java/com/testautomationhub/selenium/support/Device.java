package com.testautomationhub.selenium.support;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.bidi.browsingcontext.BrowsingContext;

public enum Device {
  PIXEL_10_PRO(427, 876),
  GALAXY_TAB_S9(640, 1024),
  GALAXY_TAB_S9_LANDSCAPE(1024, 640);

  private final int width;
  private final int height;

  Device(int width, int height) {
    this.width = width;
    this.height = height;
  }

  public void resize(WebDriver driver) {
    new BrowsingContext(driver, driver.getWindowHandle()).setViewport(width, height);
  }
}
