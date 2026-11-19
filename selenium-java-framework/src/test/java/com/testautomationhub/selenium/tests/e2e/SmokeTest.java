package com.testautomationhub.selenium.tests.e2e;

import static org.assertj.core.api.Assertions.assertThat;

import com.testautomationhub.selenium.support.BrowserTest;
import com.testautomationhub.selenium.support.Config;
import org.junit.jupiter.api.Test;

class SmokeTest extends BrowserTest {

  @Test
  void homePageLoads() {
    driver.get(Config.get("baseUrl"));
    assertThat(driver.getTitle()).contains("Folio");
  }
}
