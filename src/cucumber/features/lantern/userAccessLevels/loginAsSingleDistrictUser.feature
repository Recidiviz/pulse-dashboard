Feature: Login as a single district user
    As a MO Supervisor that has access to one district
    I want to login to the Lantern dashboard
    And see data related to the district I can access

    Background:
        Given I am on the Lantern Dashboard

    Scenario: Viewing the District Filter
        Then I should see "TCSTL" selected in the filter
        And I should not be able to change the selected district

    Scenario: Viewing the District Chart
        When I am viewing the District chart
        Then I should see district "TCSTL" highlighted on the chart
    
    # Scenario: Viewing the Case Table
    #     When I am viewing the Case Table
    #     Then I should only see cases from district "TCSTL"