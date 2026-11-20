package com.testautomationhub.selenium.tests.a11y;

import static org.assertj.core.api.Assertions.assertThat;

import com.testautomationhub.selenium.pages.AccountPage;
import com.testautomationhub.selenium.pages.BookPage;
import com.testautomationhub.selenium.pages.LibraryPage;
import com.testautomationhub.selenium.pages.ReaderPage;
import com.testautomationhub.selenium.pages.SignInPage;
import com.testautomationhub.selenium.support.Accessibility;
import com.testautomationhub.selenium.support.BrowserTest;
import com.testautomationhub.selenium.support.Config;
import com.testautomationhub.selenium.support.SignIn;
import java.time.Duration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.support.ui.WebDriverWait;

class AccessibilityTest extends BrowserTest {

  @Test
  @DisplayName("library is accessible")
  void libraryIsAccessible() {
    LibraryPage libraryPage = new LibraryPage(driver);
    libraryPage.open();
    assertThat(libraryPage.heading().isDisplayed()).isTrue();
    assertThat(Accessibility.violations(driver)).isEmpty();
  }

  @Test
  @DisplayName("book page is accessible")
  void bookPageIsAccessible() {
    BookPage bookPage = new BookPage(driver);
    driver.get(Config.get("baseUrl") + "/library/jane-austen/pride-and-prejudice");
    assertThat(bookPage.title().getText()).isEqualTo("Pride and Prejudice");
    assertThat(Accessibility.violations(driver)).isEmpty();
  }

  @Test
  @DisplayName("reader is accessible")
  void readerIsAccessible() {
    ReaderPage readerPage = new ReaderPage(driver);
    readerPage.open("/read/pride-and-prejudice/chapter-1");
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(d -> readerPage.pageLabel().isDisplayed());
    assertThat(readerPage.pageLabel().getText()).contains("Chapter 1 · Page 1 of");
    assertThat(Accessibility.violations(driver)).isEmpty();
  }

  @Test
  @DisplayName("sign-in page is accessible")
  void signInPageIsAccessible() {
    SignInPage signInPage = new SignInPage(driver);
    driver.get(Config.get("baseUrl") + "/login");
    assertThat(signInPage.submit().isDisplayed()).isTrue();
    assertThat(Accessibility.violations(driver)).isEmpty();
  }

  @Test
  @DisplayName("sign-in error is accessible")
  void signInErrorIsAccessible() {
    SignInPage signInPage = new SignInPage(driver);
    driver.get(Config.get("baseUrl") + "/login");
    signInPage.signIn("e2e-no-such-user", "not-the-password");
    new WebDriverWait(driver, Duration.ofSeconds(10)).until(d -> signInPage.error().isDisplayed());
    assertThat(signInPage.error().getText()).isEqualTo("Username or password is incorrect.");
    assertThat(Accessibility.violations(driver)).isEmpty();
  }

  @Test
  @DisplayName("signed-in library is accessible")
  void signedInLibraryIsAccessible() {
    LibraryPage libraryPage = new LibraryPage(driver);
    SignIn.as(driver, "member");
    libraryPage.open();
    assertThat(libraryPage.accountMenu().isDisplayed()).isTrue();
    assertThat(Accessibility.violations(driver)).isEmpty();
  }

  @Test
  @DisplayName("account page is accessible")
  void accountPageIsAccessible() {
    AccountPage accountPage = new AccountPage(driver);
    SignIn.as(driver, "member");
    accountPage.open();
    assertThat(driver.getCurrentUrl()).isEqualTo(Config.get("baseUrl") + "/account");
    assertThat(accountPage.title().isDisplayed()).isTrue();
    assertThat(Accessibility.violations(driver)).isEmpty();
  }
}
