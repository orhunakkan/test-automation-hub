package com.testautomationhub.selenium.tests.e2e;

import static org.assertj.core.api.Assertions.assertThat;

import com.testautomationhub.selenium.pages.LibraryPage;
import com.testautomationhub.selenium.pages.ReaderPage;
import com.testautomationhub.selenium.support.BrowserTest;
import com.testautomationhub.selenium.support.Config;
import com.testautomationhub.selenium.support.Device;
import java.time.Duration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

@EnabledIf("chromium")
class MobileTest extends BrowserTest {

  static boolean chromium() {
    return "chromium".equals(Config.get("browserName"));
  }

  @Test
  @DisplayName("Galaxy Tab S9 landscape shows the sidebar")
  void galaxyTabS9LandscapeShowsTheSidebar() {
    LibraryPage libraryPage = new LibraryPage(driver);
    Device.GALAXY_TAB_S9_LANDSCAPE.resize(driver);
    libraryPage.open();
    assertThat(libraryPage.navLinks("library")).anyMatch(WebElement::isDisplayed);
    assertThat(libraryPage.menuButton().isDisplayed()).isFalse();
  }

  @Test
  @DisplayName("Pixel 10 Pro shows the top bar")
  void pixel10ProShowsTheTopBar() {
    LibraryPage libraryPage = new LibraryPage(driver);
    Device.PIXEL_10_PRO.resize(driver);
    libraryPage.open();
    assertThat(libraryPage.menuButton().isDisplayed()).isTrue();
    assertThat(libraryPage.navLinks("library")).noneMatch(WebElement::isDisplayed);
  }

  @Test
  @DisplayName("Pixel 10 Pro menu opens the drawer")
  void pixel10ProMenuOpensTheDrawer() {
    LibraryPage libraryPage = new LibraryPage(driver);
    Device.PIXEL_10_PRO.resize(driver);
    libraryPage.open();
    libraryPage.openMenu();
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(d -> libraryPage.menuClose().isDisplayed());
    assertThat(libraryPage.navLinks("library")).anyMatch(WebElement::isDisplayed);
  }

  @Test
  @DisplayName("Pixel 10 Pro reader uses a contents drawer")
  void pixel10ProReaderUsesAContentsDrawer() {
    ReaderPage readerPage = new ReaderPage(driver);
    Device.PIXEL_10_PRO.resize(driver);
    readerPage.open("/read/pride-and-prejudice/chapter-1");
    readerPage.openContents();
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(d -> readerPage.contentsClose().isDisplayed());
    assertThat(readerPage.contentsDrawer().isDisplayed()).isTrue();
  }

  @Test
  @DisplayName("Galaxy Tab S9 shows the top bar")
  void galaxyTabS9ShowsTheTopBar() {
    LibraryPage libraryPage = new LibraryPage(driver);
    Device.GALAXY_TAB_S9.resize(driver);
    libraryPage.open();
    assertThat(libraryPage.menuButton().isDisplayed()).isTrue();
    assertThat(libraryPage.navLinks("library")).noneMatch(WebElement::isDisplayed);
  }

  @Test
  @DisplayName("Galaxy Tab S9 menu opens the drawer")
  void galaxyTabS9MenuOpensTheDrawer() {
    LibraryPage libraryPage = new LibraryPage(driver);
    Device.GALAXY_TAB_S9.resize(driver);
    libraryPage.open();
    libraryPage.openMenu();
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(d -> libraryPage.menuClose().isDisplayed());
    assertThat(libraryPage.navLinks("library")).anyMatch(WebElement::isDisplayed);
  }

  @Test
  @DisplayName("Galaxy Tab S9 reader uses a contents drawer")
  void galaxyTabS9ReaderUsesAContentsDrawer() {
    ReaderPage readerPage = new ReaderPage(driver);
    Device.GALAXY_TAB_S9.resize(driver);
    readerPage.open("/read/pride-and-prejudice/chapter-1");
    readerPage.openContents();
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(d -> readerPage.contentsClose().isDisplayed());
    assertThat(readerPage.contentsDrawer().isDisplayed()).isTrue();
  }
}
