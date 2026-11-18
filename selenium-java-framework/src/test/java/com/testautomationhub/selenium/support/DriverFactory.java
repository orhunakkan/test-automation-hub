package com.testautomationhub.selenium.support;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

/** Creates a WebDriver for the configured browser. Selenium Manager resolves drivers. */
public final class DriverFactory {

  private DriverFactory() {}

  public static WebDriver create() {
    String browser = Config.get("browser");
    boolean headless = Boolean.parseBoolean(Config.get("headless"));
    // Only for containers, where Docker blocks the namespaces Chrome's sandbox needs.
    boolean noSandbox = Boolean.parseBoolean(Config.get("noSandbox"));
    return switch (browser) {
      case "chromium" -> {
        ChromeOptions options = new ChromeOptions();
        if (headless) options.addArguments("--headless=new");
        if (noSandbox) options.addArguments("--no-sandbox");
        yield new ChromeDriver(options);
      }
      case "firefox" -> {
        FirefoxOptions options = new FirefoxOptions();
        if (headless) options.addArguments("-headless");
        yield new FirefoxDriver(options);
      }
      default -> throw new IllegalArgumentException("Unsupported browser: " + browser);
    };
  }
}
