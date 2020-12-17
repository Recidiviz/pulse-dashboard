// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

describe("createMemoryCache tests", () => {
  let cacheManager;
  let cachingSpy;
  const mockTtl = "some ttl";
  const mockRefreshThreshold = "some threshold";

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    cacheManager = require("cache-manager");
    cachingSpy = jest.spyOn(cacheManager, "caching");
  });

  it("should create cacheManager with none store", () => {
    jest.mock("../../utils/isDemoMode", () => ({
      default: true,
    }));
    const { createMemoryCache } = require("../createMemoryCache");
    createMemoryCache(mockTtl, mockRefreshThreshold);
    expect(cachingSpy).toHaveBeenCalledWith({
      store: "none",
      ttl: mockTtl,
      refreshThreshold: mockRefreshThreshold,
    });
  });

  it("should create cacheManager with memory store", () => {
    jest.mock("../../utils/isDemoMode", () => ({
      default: false,
    }));
    const { createMemoryCache } = require("../createMemoryCache");
    createMemoryCache(mockTtl, mockRefreshThreshold);
    expect(cachingSpy).toHaveBeenCalledWith({
      store: "memory",
      ttl: mockTtl,
      refreshThreshold: mockRefreshThreshold,
    });
  });
});
