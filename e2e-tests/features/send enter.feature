Feature: send enter
  In order to test
  As a tester
  I want test
  Scenario: send enter
    Given GET /file-structure is a pass-through
    And GET /config is a pass-through
    When I open Tractor
    And I go to the Component Editor
    And I enter a Component name
    Given GET /components/file/path is a pass-through
    And PUT /components/file is a pass-through
    And I send enter to browser