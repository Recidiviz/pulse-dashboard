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
const OLD_ENV = process.env;

describe("cacheManager", () => {
  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    process.env = OLD_ENV;
  });

  describe("getCache", () => {
    let getCache;

    describe("in demo mode", () => {
      beforeEach(() => {
        process.env = Object.assign(process.env, {
          IS_DEMO: "true",
          NODE_ENV: "development",
        });
        jest.resetModules();
        getCache = require("../cacheManager").getCache;
      });

      it("returns a memory cache with 'none' store", () => {
        const cache = getCache("");
        expect(cache.store.name).toEqual("none");
      });
    });

    describe("in test env", () => {
      beforeEach(() => {
        process.env = Object.assign(process.env, {
          IS_DEMO: "false",
          NODE_ENV: "test",
        });
        jest.resetModules();
        getCache = require("../cacheManager").getCache;
      });

      it("returns a memory cache", () => {
        const cache = getCache("");
        expect(cache.store.name).toEqual("memory");
      });
    });

    describe("all other requests", () => {
      beforeEach(() => {
        process.env = Object.assign(process.env, {
          IS_DEMO: "false",
          NODE_ENV: "development",
        });
        jest.resetModules();
        getCache = require("../cacheManager").getCache;
      });
      it("returns a redis cache for newRevocation", () => {
        const cache = getCache("US_PA-newRevocation-");
        expect(cache.store.name).toEqual("redis");
      });

      it("returns a redis cache for facilitiesExplore", () => {
        const cache = getCache("US_ND-facilitiesExplore");
        expect(cache.store.name).toEqual("redis");
      });
    });
  });
});
