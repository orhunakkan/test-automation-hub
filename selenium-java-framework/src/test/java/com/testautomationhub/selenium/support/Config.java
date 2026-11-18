package com.testautomationhub.selenium.support;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Properties;

public final class Config {

  private static final Properties DEFAULTS = loadDefaults();
  private static final Properties DOT_ENV = loadDotEnv();

  private Config() {}

  public static String get(String key) {
    String envKey = key.replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase();
    String value = System.getProperty(key);
    if (value == null) value = System.getenv(envKey);
    if (value == null) value = DOT_ENV.getProperty(envKey);
    if (value == null) value = DEFAULTS.getProperty(key);
    return value;
  }

  private static Properties loadDefaults() {
    Properties props = new Properties();
    try (InputStream in = Config.class.getResourceAsStream("/config.properties")) {
      if (in != null) props.load(in);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
    return props;
  }

  private static Properties loadDotEnv() {
    Properties props = new Properties();
    Path path = Path.of(".env");
    if (Files.exists(path)) {
      try (InputStream in = Files.newInputStream(path)) {
        props.load(in);
      } catch (IOException e) {
        throw new UncheckedIOException(e);
      }
    }
    return props;
  }
}
