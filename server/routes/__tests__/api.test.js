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

const {
  newRevocations,
  newRevocationFile,
  communityGoals,
  communityExplore,
  facilitiesGoals,
  facilitiesExplore,
  programmingExplore,
  refreshCache,
  responder,
} = require("../api");
const { default: refreshRedisCache } = require("../../core/refreshRedisCache");
const redisCache = require("../../core/redisCache");
const memoryCache = require("../../core/memoryCache");

jest.mock("../../core/refreshRedisCache");
jest.mock("../../core/redisCache", () => {
  return {
    cacheInRedis: jest.fn(),
  };
});
jest.mock("../../core/memoryCache", () => {
  return {
    cacheInMemory: jest.fn(),
  };
});

describe("api tests", () => {
  const stateCode = "test_id";
  const send = jest.fn();
  const req = { params: { stateCode } };
  const res = { send };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call refreshRedisCache for refreshCache ", () => {
    refreshCache(req, res);
    expect(refreshRedisCache).toHaveBeenCalledWith(
      expect.any(Function),
      stateCode,
      "newRevocation",
      expect.any(Function)
    );
  });

  it("should call cacheInRedis for newRevocation with cacheKey ", () => {
    newRevocations(req, res);
    const cacheKey = `${stateCode.toUpperCase()}-newRevocation`;
    expect(redisCache.cacheInRedis).toHaveBeenCalledWith(
      cacheKey,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should call cacheInRedis for newRevocation with file cacheKey ", () => {
    const file = "some file";
    const reqWithFile = { params: { stateCode, file } };
    const cacheKey = `${stateCode.toUpperCase()}-newRevocation-${file}`;
    newRevocationFile(reqWithFile, res);

    expect(redisCache.cacheInRedis).toHaveBeenCalledWith(
      cacheKey,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should call fetchMetrics for communityGoals with cacheKey ", () => {
    const cacheKey = `${stateCode.toUpperCase()}-communityGoals`;
    communityGoals(req, res);
    expect(memoryCache.cacheInMemory).toHaveBeenCalledWith(
      cacheKey,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should call fetchMetrics for communityExplore with cacheKey ", () => {
    const cacheKey = `${stateCode.toUpperCase()}-communityExplore`;
    communityExplore(req, res);

    expect(memoryCache.cacheInMemory).toHaveBeenCalledWith(
      cacheKey,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should call fetchMetrics for facilitiesGoals with cacheKey ", () => {
    const cacheKey = `${stateCode.toUpperCase().toUpperCase()}-facilitiesGoals`;
    facilitiesGoals(req, res);

    expect(memoryCache.cacheInMemory).toHaveBeenCalledWith(
      cacheKey,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should call fetchMetrics for facilitiesExplore with cacheKey ", () => {
    const cacheKey = `${stateCode.toUpperCase()}-facilitiesExplore`;
    facilitiesExplore(req, res);

    expect(memoryCache.cacheInMemory).toHaveBeenCalledWith(
      cacheKey,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should call fetchMetrics for programmingExplore with cacheKey ", () => {
    const cacheKey = `${stateCode.toUpperCase()}-programmingExplore`;
    programmingExplore(req, res);

    expect(memoryCache.cacheInMemory).toHaveBeenCalledWith(
      cacheKey,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should send error", () => {
    const error = "some error";
    const callback = responder(res);
    callback(error, null);

    expect(send).toHaveBeenCalledWith(error);
  });

  it("should send data", () => {
    const data = "some data";
    const callback = responder(res);
    callback(null, data);

    expect(send).toHaveBeenCalledWith(data);
  });
});
