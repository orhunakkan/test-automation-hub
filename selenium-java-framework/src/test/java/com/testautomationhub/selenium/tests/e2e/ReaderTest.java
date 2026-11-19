package com.testautomationhub.selenium.tests.e2e;

import static org.assertj.core.api.Assertions.assertThat;

import com.testautomationhub.selenium.pages.BookPage;
import com.testautomationhub.selenium.pages.ReaderPage;
import com.testautomationhub.selenium.support.BrowserTest;
import com.testautomationhub.selenium.support.Config;
import java.time.Duration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.support.ui.WebDriverWait;

class ReaderTest extends BrowserTest {

  @Test
  @DisplayName("start reading")
  void startReading() {
    BookPage bookPage = new BookPage(driver);
    ReaderPage readerPage = new ReaderPage(driver);
    driver.get(Config.get("baseUrl") + "/library/jane-austen/pride-and-prejudice");
    bookPage.startReading().click();
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(d -> readerPage.pageLabel().isDisplayed());
    assertThat(readerPage.pageLabel().getText()).contains("Chapter 1 · Page 1 of");
  }

  @Test
  @DisplayName("turn a page")
  void turnAPage() {
    ReaderPage readerPage = new ReaderPage(driver);
    driver.get(Config.get("baseUrl") + "/read/pride-and-prejudice/chapter-1");
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    wait.until(d -> readerPage.pageLabel().isDisplayed());
    assertThat(readerPage.pageLabel().getText()).contains("Chapter 1 · Page 1 of");
    readerPage.nextPage().click();
    wait.until(d -> !readerPage.pageLabel().getText().contains("Page 1 of"));
    assertThat(readerPage.pageLabel().getText()).contains("Chapter 1 · Page 2 of");
  }
}
