package com.testautomationhub.selenium.tests.e2e;

import static org.assertj.core.api.Assertions.assertThat;

import com.testautomationhub.selenium.pages.BookPage;
import com.testautomationhub.selenium.pages.LibraryPage;
import com.testautomationhub.selenium.support.BrowserTest;
import com.testautomationhub.selenium.support.Config;
import java.time.Duration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.support.ui.WebDriverWait;

class LibraryTest extends BrowserTest {

  @Test
  @DisplayName("library loads")
  void libraryLoads() {
    LibraryPage libraryPage = new LibraryPage(driver);
    driver.get(Config.get("baseUrl") + "/library");
    assertThat(libraryPage.heading().getText()).isEqualTo("Library");
  }

  @Test
  @DisplayName("library opens a book")
  void libraryOpensABook() {
    LibraryPage libraryPage = new LibraryPage(driver);
    BookPage bookPage = new BookPage(driver);
    driver.get(Config.get("baseUrl") + "/library");
    libraryPage.book("pride-and-prejudice").click();
    new WebDriverWait(driver, Duration.ofSeconds(10)).until(d -> bookPage.title().isDisplayed());
    assertThat(bookPage.title().getText()).isEqualTo("Pride and Prejudice");
    assertThat(bookPage.startReading().getText()).isEqualTo("Start reading");
  }
}
