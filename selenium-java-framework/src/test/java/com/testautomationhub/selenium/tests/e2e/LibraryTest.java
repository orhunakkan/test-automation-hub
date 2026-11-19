package com.testautomationhub.selenium.tests.e2e;

import static org.assertj.core.api.Assertions.assertThat;

import com.testautomationhub.selenium.pages.LibraryPage;
import com.testautomationhub.selenium.support.BrowserTest;
import com.testautomationhub.selenium.support.Config;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class LibraryTest extends BrowserTest {

  @Test
  @DisplayName("library loads")
  void libraryLoads() {
    LibraryPage libraryPage = new LibraryPage(driver);
    driver.get(Config.get("baseUrl") + "/library");
    assertThat(libraryPage.heading().getText()).isEqualTo("Library");
  }
}
