@skip-session-reload
Feature: Login as a user with access to all districts
    As a MO user that has unrestricted access
    I want to login to the Lantern dashboard
    And see all of the available data

    Background:
        Given I am a user that has 0 district restrictions
        And I am on the Lantern Dashboard

    Scenario: Viewing the District Filter
        Then I should see "ALL" selected in the filter
    
    Scenario: Selecting a different district in the filter
        When I select district "04" from the District Filter
        Then I should see "04" selected in the filter
        When I select district "04B" from the District Filter
        Then I should see "2 Items" selected in the filter

    Scenario: Viewing the District Chart
        When I am viewing the District chart
        And I select district "04B" from the District Filter
        Then I should see district "04B" highlighted on the chart
    
    Scenario: Viewing the Case Table
        When I am viewing the Case Table
        And I select district "04" from the District Filter
        Then I should only see cases from district "04"
