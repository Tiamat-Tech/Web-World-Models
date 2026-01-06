(function () {
  "use strict";

  var HERO_COPY = {
    title: "Roam the Galaxy Travel atlas.",
    subtitle:
      "Slide between galaxies, drag to drift through clusters, and click to open a fresh briefing. Each light is a place to wander, not just a coordinate on a map."
  };

  var STATUS_COPY = {
    lanesLabel: "STAR LANES",
    currentLabel: "CURRENT WORLD",
    lastLabel: "LAST SIGNAL",
    idleCurrent: "No planet locked yet",
    idleLast: "Awaiting your next jump"
  };

  var REGION_BANK = [
    "Halo of Embers",
    "Darkwater Reach",
    "Bright Spindle",
    "Core Halo",
    "Outer Rim Drift",
    "Nebula Frontier",
    "Kessel Verge",
    "Xandar Slip",
    "Wakanda Skies",
    "Tesseract Fold",
    "Kyber Strand"
  ];
  var SECTOR_BANK = [
    "Helios Sector",
    "Nyx Loop",
    "Lumen Veil",
    "Obsidian Spur",
    "Aquila Rim",
    "Cypher Reach",
    "Crown Drift",
    "Shadow Corridor",
    "Kree Passage",
    "Hoth Corridor",
    "Vormir Halo",
    "Nova Strand"
  ];
  var LOCATION_BANK = [
    "gravity-defying canyon rim",
    "aurora-lit docks",
    "sunset-hovering garden platforms",
    "orbital bazaar ring",
    "holographic spice quarter",
    "glass-domed skywalks",
    "ancient star-temple terrace",
    "midnight market decks",
    "kyber-lit caverns",
    "quantum hangar bays",
    "stormglass bridges",
    "celestial amphitheatre"
  ];
  var TRAVEL_STYLES = [
    "pilgrim-route shrine",
    "contraband exchange hub",
    "luxury nebula resort",
    "frontier research outpost",
    "lost-republic relay",
    "smuggler-run waypoint",
    "deep-void refueling spine",
    "quiet monastic world",
    "celestial archive",
    "warp-bloom observatory"
  ];
  var WORLD_DESCRIPTORS = [
    "nebula-swept shrine world",
    "hollow ice moon",
    "storm-tossed ocean sphere",
    "floating-reef archipelago",
    "ringed gas-giant colony",
    "fractured asteroid habitat",
    "bioluminescent jungle world",
    "city-world of stacked towers",
    "luminous kyber reef",
    "stormglass citadel",
    "dust-red dune planet",
    "orbital scrapyard metropolis"
  ];
  var PROMPT_INTROS = [
    "Drop out of slipspace near {world}, a {descriptor} in the {sector}.",
    "Skim the jump haze into {world}, legendary within the {sector}.",
    "Materialize inside {world}'s orbit; the {descriptor} glows against the {sector} darkness."
  ];
  var ACTION_SNIPPETS = [
    "Begin at the {location}, {action}.",
    "Link with scouts at the {location} before you {action}.",
    "Thread local skiffs through the {location} and {action}."
  ];
  var ACTIONS = [
    "walk the market with borrowed enviro-suits",
    "descend to forgotten hymn vaults",
    "ride maintenance rails beyond the safe beacons",
    "float weightless through cracked naves",
    "follow smugglers' lanterns toward the rim",
    "drift in panoramic pods while cataloging debris",
    "climb grav-cables to survey towers",
    "share spiced tea with station caretakers"
  ];
  var MOOD_SNIPPETS = [
    "Capture the feeling while ion storms paint the sky.",
    "Listen as distant radio choirs bleed across the hull.",
    "Feel twin moons rise over shattered rings.",
    "Trace hyperspace scars that pulse along the nebula's edge.",
    "Let cargo drones hum their lullabies through the dark.",
    "Watch beacon towers flicker like slow breathing giants."
  ];
  var WORLD_PREFIXES = [
    "Vesper",
    "Kaelum",
    "Seraphis",
    "Aurelia",
    "Velis",
    "Nyros",
    "Solace",
    "Vorant",
    "Cyrion",
    "Halion",
    "Threx",
    "Tato",
    "Hoth",
    "Vorm",
    "Nova",
    "Yaka",
    "Sakaar",
    "Arda",
    "Krypton",
    "Artemis"
  ];
  var WORLD_SUFFIXES = [
    " Prime",
    " Haven",
    " Ring",
    " Station",
    " Outpost",
    " Anchorage",
    " Reach",
    " Minor",
    " Major",
    " Array",
    " Nexus",
    " Spire",
    " Gate",
    " Drift",
    " Belt"
  ];
  var PLANET_SIZE_RANGE = { min: 0.08, max: 0.16 };
  var AUTO_SPIN_SPEED = 0.0005;
  var GALAXY_SPREAD = 6.5;
  var GALAXY_RING_MIN = 3.5;
  var GALAXY_RING_MAX = 7;
  var GALAXY_STEP = 1;
  var GALAXY_NAMES_LEFT = [
    "Asterion",
    "Cinder",
    "Lumen",
    "Vesper",
    "Saffron",
    "Eclipse",
    "Solstice",
    "Ember",
    "Halo",
    "Myriad",
    "Nocturne",
    "Kyber",
    "Starlace",
    "Quantum",
    "Nova",
    "Hyperion"
  ];
  var GALAXY_NAMES_RIGHT = [
    "Reach",
    "Spiral",
    "Cove",
    "Array",
    "Crescent",
    "Run",
    "Plume",
    "Drift",
    "Arc",
    "Harbor",
    "Verse",
    "Concourse",
    "Lattice",
    "Wreath",
    "Corridor"
  ];
  var REBUILD_DEBOUNCE_MS = 450;

  var mapPlane = document.getElementById("atlas-map-plane");
  var heroHeadingEl = document.getElementById("atlas-hero-heading");
  var heroSubheadingEl = document.getElementById("atlas-hero-subheading");
  var nowFocusedEl = document.getElementById("atlas-now-focused");
  var pinCountEl = document.getElementById("atlas-pin-count");
  var debugLabelEl = document.getElementById("atlas-debug-label");
  var pillPathsLabelEl = document.getElementById("atlas-pill-paths-label");
  var pillCurrentLabelEl = document.getElementById("atlas-pill-current-label");
  var pillLastLabelEl = document.getElementById("atlas-pill-last-label");
  var detailPanel = document.getElementById("atlas-detail-panel");
  var detailTitleEl = document.getElementById("atlas-detail-title");
  var detailMetaEl = document.getElementById("atlas-detail-meta");
  var detailBodyEl = document.getElementById("atlas-detail-body");
  var regenButton = document.getElementById("atlas-regen-button");
  var planetCountInput = document.getElementById("atlas-planet-count");
  var planetCountLabelEl = document.getElementById("atlas-planet-count-label");
  var galaxyPagerEl = document.getElementById("atlas-galaxy-pager");
  var galaxyPrevEl = document.getElementById("atlas-galaxy-prev");
  var galaxyNextEl = document.getElementById("atlas-galaxy-next");
  var galaxyStatusEl = document.getElementById("atlas-galaxy-status");
  var threadButton = document.getElementById("atlas-thread-button");
  var threadListEl = document.getElementById("atlas-thread-list");
  var threadTitleEl = document.getElementById("atlas-thread-title");

  var galaxyPoints = [];
  var galaxyLayer = 0;
  var galaxyOffset = { x: 0, y: 0, z: 0 };
  var galaxyName = "";
  var planetIntelCache = new Map();
  var currentGalaxyPoint = null;
  var tooltipEl = null;
  var pointerPosition = { x: 0, y: 0 };
  var currentScene = null;
  var animationFrameId = null;
  var regenHandle = null;

  initGalaxyInterface();

  function initGalaxyInterface() {
    setHeroCopy();
    setStatusLabels();
    updateGalaxyStatus();
    attachControlHandlers();
    setStatusPillsIdle();
    renderHomeDetailPlaceholder();
    initGalaxyScene();
  }

  function attachControlHandlers() {
    if (planetCountInput) {
      if (!planetCountInput.value) {
        planetCountInput.value = "220";
      }
      updatePlanetCountLabel();
      planetCountInput.addEventListener("input", function () {
        updatePlanetCountLabel();
        scheduleSwarmRebuild();
      });
    }
    if (galaxyPrevEl) {
      galaxyPrevEl.addEventListener("click", function () {
        galaxyLayer = Math.max(0, galaxyLayer - GALAXY_STEP);
        handleRegenerateRequest();
        updateGalaxyStatus();
      });
    }
    if (galaxyNextEl) {
      galaxyNextEl.addEventListener("click", function () {
        galaxyLayer += GALAXY_STEP;
        handleRegenerateRequest();
        updateGalaxyStatus();
      });
    }
    if (regenButton) {
      regenButton.addEventListener("click", function () {
        handleRegenerateRequest();
      });
    }
    if (threadButton) {
      threadButton.addEventListener("click", function () {
        weaveVoyagerThread();
      });
    }
  }

  function describeDensityLabel(value) {
    if (value <= 0) {
      return "Seeding orbitals…";
    }
    if (value <= 90) {
      return "Sparse drift";
    }
    if (value <= 150) {
      return "Gathering bloom";
    }
    if (value <= 320) {
      return "Growing constellation";
    }
    return "Dense signal belt";
  }

  function updateGalaxyStatus() {
    if (!galaxyStatusEl) {
      return;
    }
    galaxyName = buildGalaxyName(galaxyLayer);
    var descriptor = galaxyLayer === 0 ? "Home spiral" : "Outer band " + galaxyLayer;
    galaxyStatusEl.textContent = galaxyName + " · " + descriptor;
    if (galaxyPrevEl) {
      galaxyPrevEl.disabled = galaxyLayer <= 0;
    }
    if (threadTitleEl) {
      threadTitleEl.textContent = "Voyager thread · " + galaxyName;
    }
  }

  function updatePlanetCountLabel() {
    if (!planetCountLabelEl || !planetCountInput) {
      return;
    }
    var value = Number.parseInt(planetCountInput.value || "0", 10);
    planetCountLabelEl.textContent = describeDensityLabel(value);
  }

  function scheduleSwarmRebuild() {
    if (regenHandle) {
      clearTimeout(regenHandle);
    }
    regenHandle = setTimeout(handleRegenerateRequest, REBUILD_DEBOUNCE_MS);
  }

  function handleRegenerateRequest() {
    planetIntelCache.clear();
    currentGalaxyPoint = null;
    setStatusPillsIdle();
    initGalaxyScene();
  }

  function setHeroCopy() {
    if (heroHeadingEl) {
      heroHeadingEl.textContent = HERO_COPY.title;
    }
    if (heroSubheadingEl) {
      heroSubheadingEl.textContent = HERO_COPY.subtitle;
    }
  }

  function setStatusLabels() {
    if (pillPathsLabelEl) {
      pillPathsLabelEl.textContent = STATUS_COPY.lanesLabel;
    }
    if (pillCurrentLabelEl) {
      pillCurrentLabelEl.textContent = STATUS_COPY.currentLabel;
    }
    if (pillLastLabelEl) {
      pillLastLabelEl.textContent = STATUS_COPY.lastLabel;
    }
  }

  function updateGalaxyCountLabel() {
    if (!pinCountEl) {
      return;
    }
    var count = galaxyPoints.length;
    pinCountEl.textContent = describeDensityLabel(count);
  }

  function setStatusPillsIdle() {
    updateGalaxyCountLabel();
    if (nowFocusedEl) {
      nowFocusedEl.textContent = STATUS_COPY.idleCurrent;
    }
    if (debugLabelEl) {
      debugLabelEl.textContent = STATUS_COPY.idleLast;
    }
  }

  function renderHomeDetailPlaceholder() {
    if (detailPanel) {
      detailPanel.classList.add("is-idle");
    }
    if (detailTitleEl) {
      detailTitleEl.textContent = "Select a planet to open its log.";
    }
    if (detailMetaEl) {
      detailMetaEl.textContent = "Signals sharpen the moment you rest your eyes on a world.";
    }
    if (detailBodyEl) {
      detailBodyEl.innerHTML =
        '<p class="atlas-detail-placeholder">Hover to scout a planet. Click to pull a living field note—each briefing is written like a letter from a traveler, not a machine.</p>';
    }
    renderVoyagerThreadPlaceholder();
  }

  function initGalaxyScene() {
    if (!mapPlane) {
      return;
    }
    destroyCurrentScene();
    mapPlane.classList.add("galaxy-mode");
    var count = getRequestedPlanetCount();
    mapPlane.innerHTML =
      '<div class="atlas-galaxy-loading">Seeding galaxy ' + galaxyLayer + " with " + count + " procedural worlds…</div>";
    requestAnimationFrame(function () {
      galaxyOffset = computeGalaxyOffset(galaxyLayer);
      galaxyPoints = buildProceduralGalaxy(count);
      setStatusPillsIdle();
      updateGalaxyCountLabel();
      setupGalaxyScene(mapPlane, galaxyPoints);
    });
  }

  function getRequestedPlanetCount() {
    if (!planetCountInput) {
      return 180;
    }
    var parsed = Number.parseInt(planetCountInput.value || "0", 10);
    if (!Number.isFinite(parsed) || parsed < 10) {
      return 180;
    }
    var scale = 1 + Math.min(galaxyLayer, 10) * 0.18;
    var boosted = Math.round(parsed * scale + galaxyLayer * 18);
    return Math.min(780, Math.max(80, boosted));
  }

  function buildProceduralGalaxy(count) {
    var worlds = [];
    var timestampSeed = Date.now();
    var offset = computeGalaxyOffset(galaxyLayer);
    var galaxyPrompt = buildGalaxyPrompt(galaxyLayer, offset);
    for (var i = 0; i < count; i += 1) {
      worlds.push(createProceduralPlanet(i, timestampSeed + i, galaxyLayer, offset, galaxyPrompt));
    }
    var coreFillCount = Math.max(24, Math.floor(count * 0.25));
    worlds = worlds.concat(seedCoreSwarm(coreFillCount, timestampSeed + 777, offset, galaxyPrompt));
    worlds.push(createAnchorPlanet(timestampSeed + count, offset, galaxyPrompt));
    return worlds;
  }

  function createProceduralPlanet(index, seed, layer, offset, galaxyPrompt) {
    var direction = randomUnitVector(seed);
    var clusterSpread = 2.6 + Math.random() * 2.8;
    var ringSpread = GALAXY_RING_MIN + Math.random() * (GALAXY_RING_MAX - GALAXY_RING_MIN);
    var radialScalar = clusterSpread + layer * (ringSpread * 0.2);
    var worldName = generateWorldName(index + seed);
    var region = randomItem(REGION_BANK);
    var sector = randomItem(SECTOR_BANK);
    var location = randomItem(LOCATION_BANK);
    var travelStyle = randomItem(TRAVEL_STYLES);
    var descriptor = randomItem(WORLD_DESCRIPTORS);
    var introTemplate = randomItem(PROMPT_INTROS);
    var actionTemplate = randomItem(ACTION_SNIPPETS);
    var prompt = [
      introTemplate
        .replace("{world}", worldName)
        .replace("{descriptor}", descriptor)
        .replace("{sector}", sector),
      actionTemplate
        .replace("{location}", location)
        .replace("{action}", randomItem(ACTIONS))
        .replace("{style}", travelStyle),
      randomItem(MOOD_SNIPPETS)
    ].join(" ");
    var planetPrompt = buildPlanetPrompt(worldName, region, sector, descriptor, travelStyle, location);

    var planet = {
      id: "procedural-" + seed + "-" + index,
      region: region,
      sector: sector,
      system: worldName + " Array",
      world: worldName,
      location: location,
      travel_style: travelStyle,
      prompt: planetPrompt + " " + prompt,
      planetPrompt: planetPrompt,
      galaxyPrompt: galaxyPrompt,
      galaxyName: galaxyName,
      x: direction.x * radialScalar + offset.x,
      y: direction.y * (radialScalar * 0.6) + (offset.y || 0),
      z: direction.z * radialScalar + offset.z,
      size: PLANET_SIZE_RANGE.min + Math.random() * (PLANET_SIZE_RANGE.max - PLANET_SIZE_RANGE.min)
    };
    return planet;
  }

  function createAnchorPlanet(seed, offset, galaxyPrompt) {
    var coreName = galaxyName || buildGalaxyName(galaxyLayer);
    var worldName = coreName + " Anchor";
    var descriptor = "quiet waypoint under the main lane";
    var location = "central docking cradle";
    var region = "Anchor Sector";
    var sector = "Core Array";
    var prompt = buildPlanetPrompt(worldName, region, sector, descriptor, "wayfinding stop", location);
    return {
      id: "anchor-" + seed,
      region: region,
      sector: sector,
      system: worldName,
      world: worldName,
      location: location,
      travel_style: "wayfinding stop",
      prompt: prompt,
      planetPrompt: prompt,
      galaxyPrompt: galaxyPrompt,
      galaxyName: coreName,
      x: offset.x,
      y: offset.y,
      z: offset.z,
      size: PLANET_SIZE_RANGE.max * 1.35
    };
  }

  function seedCoreSwarm(count, seed, offset, galaxyPrompt) {
    var swarm = [];
    for (var i = 0; i < count; i += 1) {
      var angle = (i / count) * Math.PI * 2 + pseudoRandom(seed + i) * 0.8;
      var radius = 1.4 + pseudoRandom(seed + i * 3) * 1.4;
      var worldName = generateWorldName(seed + i * 5) + " Node";
      var descriptor = randomItem(WORLD_DESCRIPTORS);
      var location = randomItem(LOCATION_BANK);
      var planetPrompt = buildPlanetPrompt(worldName, "Core Verge", "Anchor Halo", descriptor, "wayfinding", location);
      swarm.push({
        id: "core-" + seed + "-" + i,
        region: "Core Verge",
        sector: "Anchor Halo",
        system: worldName,
        world: worldName,
        location: location,
        travel_style: "wayfinding",
        prompt: planetPrompt,
        planetPrompt: planetPrompt,
        galaxyPrompt: galaxyPrompt,
        galaxyName: galaxyName,
        x: Math.cos(angle) * radius + offset.x,
        y: (pseudoRandom(seed + i * 7) - 0.5) * 0.6 + offset.y,
        z: Math.sin(angle) * radius + offset.z,
        size: PLANET_SIZE_RANGE.min + Math.random() * (PLANET_SIZE_RANGE.max - PLANET_SIZE_RANGE.min)
      });
    }
    return swarm;
  }

  function randomUnitVector(seed) {
    var u = pseudoRandom(seed) * 2 - 1;
    var theta = pseudoRandom(seed + 7) * Math.PI * 2;
    var sqrt = Math.sqrt(1 - u * u);
    return { x: sqrt * Math.cos(theta), y: u, z: sqrt * Math.sin(theta) };
  }

  function randomItem(list) {
    if (!list.length) {
      return "";
    }
    var index = Math.floor(Math.random() * list.length);
    return list[index] ?? list[0];
  }

  function generateWorldName(seed) {
    var prefix = WORLD_PREFIXES[Math.floor(pseudoRandom(seed) * WORLD_PREFIXES.length)] ?? WORLD_PREFIXES[0];
    var suffix = WORLD_SUFFIXES[Math.floor(pseudoRandom(seed + 3) * WORLD_SUFFIXES.length)] ?? WORLD_SUFFIXES[0];
    return prefix + suffix;
  }

  function pseudoRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function computeGalaxyOffset(layer) {
    if (layer <= 0) {
      return { x: 0, y: 0, z: 0 };
    }
    var golden = 2.39996322972865332;
    var radius = Math.sqrt(layer + 1) * 5.8;
    var angle = golden * layer;
    return {
      x: Math.cos(angle) * radius,
      y: 0,
      z: Math.sin(angle) * radius
    };
  }

  function buildGalaxyName(layer) {
    var left = GALAXY_NAMES_LEFT[layer % GALAXY_NAMES_LEFT.length];
    var right = GALAXY_NAMES_RIGHT[layer % GALAXY_NAMES_RIGHT.length];
    return left + " " + right;
  }

  function renderVoyagerThreadPlaceholder() {
    if (!threadListEl) {
      return;
    }
    threadListEl.innerHTML = "<li>Tap “Weave a long drift” to sketch a multi-galaxy route.</li>";
  }

  function weaveVoyagerThread(activePlanet) {
    if (!threadListEl) {
      return;
    }
    var seed = Date.now() + galaxyLayer * 97 + (activePlanet ? activePlanet.id.length : 0);
    var stops = [];
    var hopCount = 5 + Math.floor(pseudoRandom(seed) * 3); // 5-7 stops
    for (var i = 0; i < hopCount; i += 1) {
      var layer = (galaxyLayer + i) % (GALAXY_NAMES_LEFT.length + GALAXY_NAMES_RIGHT.length);
      var name = buildGalaxyName(layer);
      var world = generateWorldName(seed + i * 11);
      var waypoint = randomItem(LOCATION_BANK);
      var descriptor = randomItem(WORLD_DESCRIPTORS);
      stops.push(
        name +
          " · " +
          world +
          " — " +
          descriptor +
          "; skim past the " +
          waypoint +
          " before your next burn."
      );
    }
    threadListEl.innerHTML = stops
      .map(function (stop) {
        return "<li>" + stop + "</li>";
      })
      .join("");
  }


  function buildGalaxyPrompt(layer, offset) {
    var lane = layer === 0 ? "homeway spiral" : "outer band " + layer;
    return (
      "Galaxy Travel log · " +
      (galaxyName || lane) +
      " — drifting near (" +
      offset.x.toFixed(1) +
      ", " +
      offset.z.toFixed(1) +
      "). Expect slow-moving light lanes, blue-violet haze, and a few solitary suns carving their own paths."
    );
  }

  function buildPlanetPrompt(worldName, region, sector, descriptor, style, location) {
    var regionLabel = region || "uncharted span";
    var sectorLabel = sector || "quiet sector";
    var anchor = location || "lone docking ring";
    return (
      "Touch down at " +
      worldName +
      ", a " +
      descriptor +
      " tucked inside the " +
      sectorLabel +
      ". This lane feels " +
      style +
      "; start at the " +
      anchor +
      " and let the local tempo set your pace in " +
      regionLabel +
      "."
    );
  }

  function destroyCurrentScene() {
    if (!currentScene) {
      return;
    }
    if (currentScene.resizeHandler) {
      window.removeEventListener("resize", currentScene.resizeHandler);
    }
    if (currentScene.interactionCleanup) {
      currentScene.interactionCleanup();
    }
    if (currentScene.laneResources && currentScene.scene) {
      currentScene.laneResources.forEach(function (lane) {
        if (lane.line && currentScene.scene) {
          currentScene.scene.remove(lane.line);
        }
        if (lane.geometry && typeof lane.geometry.dispose === "function") {
          lane.geometry.dispose();
        }
        if (lane.material && typeof lane.material.dispose === "function") {
          lane.material.dispose();
        }
      });
    }
    if (currentScene.renderer && typeof currentScene.renderer.dispose === "function") {
      currentScene.renderer.dispose();
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (mapPlane) {
      mapPlane.innerHTML = "";
    }
    tooltipEl = null;
    currentScene = null;
  }

  function setupGalaxyScene(container, points) {
    var width = container.clientWidth || container.offsetWidth || 600;
    var height = container.clientHeight || container.offsetHeight || 520;
    container.innerHTML = "";

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050513, 4, 9);
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);

    var ambient = new THREE.AmbientLight(0x667aff, 0.55);
    var keyLight = new THREE.PointLight(0xffffff, 1.2, 0, 2);
    keyLight.position.set(3, 3, 3);
    var rimLight = new THREE.PointLight(0x5eead4, 0.6, 0, 2);
    rimLight.position.set(-3, -2, -2);
    scene.add(ambient);
    scene.add(keyLight);
    scene.add(rimLight);

    var bgGeometry = new THREE.SphereGeometry(8, 48, 48);
    var bgMaterial = new THREE.MeshBasicMaterial({
      color: 0x050716,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.94
    });
    scene.add(new THREE.Mesh(bgGeometry, bgMaterial));

    var scatterCount = 1800;
    var scatterPositions = new Float32Array(scatterCount * 3);
    for (var i = 0; i < scatterCount * 3; i += 3) {
      scatterPositions[i] = (Math.random() - 0.5) * 14 + galaxyOffset.x;
      scatterPositions[i + 1] = (Math.random() - 0.5) * 14 + galaxyOffset.y;
      scatterPositions[i + 2] = (Math.random() - 0.5) * 14 + galaxyOffset.z;
    }
    var scatterGeometry = new THREE.BufferGeometry();
    scatterGeometry.setAttribute("position", new THREE.BufferAttribute(scatterPositions, 3));
    var scatterMaterial = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.02,
      transparent: true,
      opacity: 0.6
    });
    scene.add(new THREE.Points(scatterGeometry, scatterMaterial));

    var planetGeometry = new THREE.SphereGeometry(1, 48, 48);
    var animationEntries = [];
    points.forEach(function (gp, index) {
      var group = new THREE.Group();
      group.position.set(gp.x, gp.y, gp.z);
      setGalaxyUserData(group, gp);

      var planet = new THREE.Mesh(planetGeometry, createPlanetMaterial(index));
      planet.scale.setScalar(gp.size);
      setGalaxyUserData(planet, gp);
      group.add(planet);

      var halo = new THREE.Mesh(
        new THREE.SphereGeometry(gp.size * 1.35, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.04 })
      );
      halo.scale.setScalar(1 + Math.random() * 0.2);
      setGalaxyUserData(halo, gp);
      group.add(halo);

      maybeAddRing(group, gp.size, gp, index);
      maybeAddSatellite(group, gp.size, gp);
      scene.add(group);

      animationEntries.push({
        object: group,
        baseY: group.position.y,
        spin: 0.001 + Math.random() * 0.002,
        floatAmp: 0.04 + Math.random() * 0.08,
      floatOffset: Math.random() * Math.PI * 2
    });
  });

    var starLanes = buildStarLanes(scene, points);

    function onGalaxyResize() {
      if (!currentScene || currentScene.scene !== scene) {
        return;
      }
      var newWidth = container.clientWidth || container.offsetWidth || width;
      var newHeight = container.clientHeight || container.offsetHeight || height;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    }

    var interaction = initGalaxyInteraction(scene, camera, renderer.domElement, galaxyOffset);
    window.addEventListener("resize", onGalaxyResize);
    currentScene = {
      scene: scene,
      camera: camera,
      renderer: renderer,
      resizeHandler: onGalaxyResize,
      interactionCleanup: interaction.cleanup,
      orbit: interaction,
      animations: animationEntries,
      laneAnimations: starLanes.animations,
      laneResources: starLanes.resources
    };

    function animate() {
      if (!currentScene || currentScene.scene !== scene) {
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      var now = performance.now();
      currentScene.animations.forEach(function (entry) {
        entry.object.rotation.y += entry.spin;
        var bob = Math.sin(now * entry.spin * 1.3 + entry.floatOffset) * entry.floatAmp;
        entry.object.position.y = entry.baseY + bob;
      });
      currentScene.laneAnimations.forEach(function (lane) {
        var pulse = 0.16 + 0.12 * Math.sin(now * lane.speed + lane.phase);
        lane.material.opacity = 0.18 + pulse;
      });
      if (interaction && !interaction.isUserRotating && !interaction.isAnimating) {
        interaction.state.phi += AUTO_SPIN_SPEED;
        interaction.applyOrbit();
      }
      renderer.render(scene, camera);
    }

    animate();
  }

  function initGalaxyInteraction(scene, camera, canvas, offset) {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var hoveredStar = null;
    var pointerDown = false;
    var dragDistance = 0;
    var lastPointer = { x: 0, y: 0 };

    var orbitState = {
      theta: Math.PI / 2.4,
      phi: -0.9,
      distance: 4.4
    };

    function applyOrbit() {
      var theta = orbitState.theta;
      var phi = orbitState.phi;
      var dist = orbitState.distance;
      var x = dist * Math.sin(theta) * Math.cos(phi);
      var z = dist * Math.sin(theta) * Math.sin(phi);
      var y = dist * Math.cos(theta);
      var target = offset || { x: 0, y: 0, z: 0 };
      camera.position.set(x + target.x, y + target.y, z + target.z);
      camera.lookAt(target.x, target.y, target.z);
    }

    applyOrbit();

    function onPointerDown(event) {
      pointerDown = true;
      dragDistance = 0;
      lastPointer.x = event.clientX;
      lastPointer.y = event.clientY;
      controller.isUserRotating = true;
      if (typeof canvas.setPointerCapture === "function") {
        canvas.setPointerCapture(event.pointerId);
      }
    }

    function onPointerMove(event) {
      pointerPosition = { x: event.clientX, y: event.clientY };
      var rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      var intersects = raycaster.intersectObjects(scene.children, true);
      var hit = intersects.find(function (entry) {
        return entry.object.userData && entry.object.userData.galaxyPoint;
      });
      if (hit) {
        hoveredStar = hit.object;
        showGalaxyTooltip(hit.object.userData.galaxyPoint);
      } else if (!pointerDown) {
        hoveredStar = null;
        hideTooltip();
        restoreIdleStatus();
      }
      if (pointerDown) {
        var deltaX = event.clientX - lastPointer.x;
        var deltaY = event.clientY - lastPointer.y;
        dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
        orbitState.phi -= deltaX * 0.003;
        orbitState.theta -= deltaY * 0.003;
        orbitState.theta = clamp(orbitState.theta, 0.2, Math.PI - 0.2);
        orbitState.distance = clamp(orbitState.distance, 1.4, 6);
        applyOrbit();
        lastPointer.x = event.clientX;
        lastPointer.y = event.clientY;
      }
    }

    function onPointerUp(event) {
      pointerDown = false;
      controller.isUserRotating = false;
      if (typeof canvas.releasePointerCapture === "function") {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch (_err) {
          // ignore release errors
        }
      }
    }

    function onWheel(event) {
      event.preventDefault();
      orbitState.distance += event.deltaY * 0.0015;
      orbitState.distance = clamp(orbitState.distance, 1.3, 6.5);
      applyOrbit();
    }

    function onClick() {
      if (dragDistance > 6) {
        return;
      }
      if (!hoveredStar) {
        return;
      }
      var gp = hoveredStar.userData.galaxyPoint;
      onGalaxyPointSelected(gp);
    }

    function onMouseLeave() {
      hoveredStar = null;
      hideTooltip();
      restoreIdleStatus();
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onMouseLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("click", onClick);

    var controller = {
      state: orbitState,
      applyOrbit: applyOrbit,
      isUserRotating: false,
      isAnimating: false,
      cleanup: function () {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointerleave", onMouseLeave);
        canvas.removeEventListener("wheel", onWheel);
        canvas.removeEventListener("click", onClick);
      }
    };

    return controller;
  }

  function setGalaxyUserData(object3d, gp) {
    if (!object3d) {
      return;
    }
    object3d.userData = object3d.userData || {};
    object3d.userData.galaxyPoint = gp;
  }

  function createPlanetMaterial(index) {
    var palette = [
      0xffe066,
      0xffadad,
      0x94b3fd,
      0xc084fc,
      0x7dd3fc,
      0xfde68a,
      0xa7f3d0,
      0xf9a8d4
    ];
    var color = new THREE.Color(palette[index % palette.length]);
    return new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.25,
      roughness: 0.45,
      emissive: color.clone().multiplyScalar(0.14),
      emissiveIntensity: 0.45
    });
  }

  function maybeAddRing(group, sizeScalar, gp, index) {
    if (Math.random() > 0.4) {
      return;
    }
    var ringColors = [0xfcd34d, 0xf472b6, 0x34d399, 0xfbbf24, 0x93c5fd];
    var ringColor = new THREE.Color(ringColors[index % ringColors.length]);
    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(sizeScalar * 1.6, sizeScalar * 0.07, 24, 72),
      new THREE.MeshStandardMaterial({
        color: ringColor,
        emissive: ringColor.clone().multiplyScalar(0.4),
        emissiveIntensity: 0.6,
        roughness: 0.35,
        metalness: 0.18
      })
    );
    ring.rotation.x = Math.random() * Math.PI;
    ring.rotation.y = Math.random() * Math.PI;
    setGalaxyUserData(ring, gp);
    group.add(ring);
  }

  function maybeAddSatellite(group, sizeScalar, gp) {
    if (Math.random() > 0.55) {
      return;
    }
    var satellite = new THREE.Mesh(
      new THREE.SphereGeometry(sizeScalar * 0.35, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x7dd3fc,
        emissiveIntensity: 0.25,
        roughness: 0.65,
        metalness: 0.1
      })
    );
    satellite.position.set(sizeScalar * 2.3, 0, 0);
    setGalaxyUserData(satellite, gp);
    group.add(satellite);
  }

  function buildStarLanes(scene, points) {
    var lanes = [];
    var animations = [];
    if (!points.length) {
      return { resources: lanes, animations: animations };
    }
    var laneCount = Math.min(4, Math.max(1, Math.floor(points.length / 120) + 1));
    for (var i = 0; i < laneCount; i += 1) {
      var nodes = selectLaneNodes(points, 5 + Math.floor(Math.random() * 3));
      if (nodes.length < 2) {
        continue;
      }
      var curve = new THREE.CatmullRomCurve3(nodes);
      var samples = curve.getPoints(160);
      var geometry = new THREE.BufferGeometry().setFromPoints(samples);
      var material = new THREE.LineBasicMaterial({
        color: 0x86e8ff,
        transparent: true,
        opacity: 0.22,
        depthWrite: false
      });
      var line = new THREE.Line(geometry, material);
      line.userData.isStarLane = true;
      scene.add(line);
      lanes.push({ line: line, geometry: geometry, material: material });
      animations.push({
        material: material,
        speed: 0.0008 + Math.random() * 0.0008,
        phase: Math.random() * Math.PI * 2
      });
    }
    return { resources: lanes, animations: animations };
  }

  function selectLaneNodes(points, count) {
    var shuffled = points
      .slice()
      .sort(function () {
        return Math.random() - 0.5;
      })
      .slice(0, count);
    return shuffled.map(function (gp) {
      return new THREE.Vector3(gp.x, gp.y, gp.z);
    });
  }

  function ensureTooltip() {
    if (tooltipEl || !mapPlane) {
      return;
    }
    tooltipEl = document.createElement("div");
    tooltipEl.className = "atlas-tooltip";
    mapPlane.appendChild(tooltipEl);
  }

  function showGalaxyTooltip(gp) {
    ensureTooltip();
    if (!tooltipEl) {
      return;
    }
    var primary = gp.world || gp.system || "Unknown system";
    var secondary = [gp.region, gp.sector].filter(Boolean).join(" • ") || gp.location || "Uncharted";
    var whisper = gp.planetPrompt || gp.prompt || "Whispers of warm docks and drifting satellites.";
    tooltipEl.innerHTML =
      "<strong>" + primary + "</strong><span>" + secondary + "</span><p>" + whisper + "</p>";
    tooltipEl.classList.add("visible");
    updateTooltipPosition();
  }

  function hideTooltip() {
    if (tooltipEl) {
      tooltipEl.classList.remove("visible");
    }
  }

  function updateTooltipPosition() {
    if (!tooltipEl || !mapPlane) {
      return;
    }
    var rect = mapPlane.getBoundingClientRect();
    var left = pointerPosition.x - rect.left;
    var top = pointerPosition.y - rect.top;
    tooltipEl.style.left = left + "px";
    tooltipEl.style.top = Math.max(top - 12, 8) + "px";
  }

  function onGalaxyPointSelected(gp) {
    currentGalaxyPoint = gp;
    updateStatusPillsForSelection(gp);
    showIntelLoadingState(gp);
    flyToGalaxyPoint(gp);
    fetchPlanetIntel(gp)
      .then(function (intel) {
        if (currentGalaxyPoint !== gp) {
          return;
        }
        renderPlanetIntel(gp, intel);
      })
      .catch(function (error) {
        if (currentGalaxyPoint !== gp) {
          return;
        }
        renderPlanetIntelError(error);
      });
    dispatchGalaxySelectionEvent(gp);
    weaveVoyagerThread(gp);
  }

  function updateStatusPillsForSelection(gp) {
    if (nowFocusedEl) {
      nowFocusedEl.textContent = formatGalaxySystemLabel(gp);
    }
    if (debugLabelEl) {
      debugLabelEl.textContent = "Jumped to " + (gp.system || gp.world || "a new system");
    }
    updateGalaxyCountLabel();
  }

  function formatGalaxySystemLabel(gp) {
    var primary = gp.world || gp.system || "Unknown system";
    var region = gp.region || gp.sector;
    return region ? primary + " · " + region : primary;
  }

  function showIntelLoadingState(gp) {
    if (detailPanel) {
      detailPanel.classList.remove("is-idle");
    }
    if (detailTitleEl) {
      detailTitleEl.textContent = (gp.system || gp.world || "Linking relay") + " · syncing…";
    }
    if (detailMetaEl) {
      detailMetaEl.textContent = "Routing story beacons through " + (gp.sector || "uncharted lanes");
    }
    if (detailBodyEl) {
      detailBodyEl.innerHTML =
        '<p class="atlas-detail-placeholder">Calibrating mission beacons… stand by for a live transmission.</p>';
    }
  }

  function fetchPlanetIntel(gp) {
    var cacheKey = gp.id || gp.system || gp.world;
    if (cacheKey && planetIntelCache.has(cacheKey)) {
      return Promise.resolve(planetIntelCache.get(cacheKey));
    }
    return fetch("/api/galaxy/planets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: gp.system,
        world: gp.world,
        region: gp.region,
        sector: gp.sector,
        location: gp.location,
        travelStyle: gp.travel_style,
        basePrompt: gp.prompt,
        galaxyPrompt: gp.galaxyPrompt,
        planetPrompt: gp.planetPrompt
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Signal relay unavailable (" + response.status + ")");
        }
        return response.json();
      })
      .then(function (intel) {
        if (cacheKey) {
          planetIntelCache.set(cacheKey, intel);
        }
        return intel;
      });
  }

  function renderPlanetIntel(gp, intel) {
    if (detailPanel) {
      detailPanel.classList.remove("is-idle");
    }
    if (detailTitleEl) {
      detailTitleEl.textContent = intel.planetName || gp.world || gp.system || "Unknown world";
    }
    if (detailMetaEl) {
      var meta = [gp.region, gp.sector, intel.sky].filter(Boolean).join(" • ");
      detailMetaEl.textContent = meta || "Telemetry stream stabilized";
    }
    if (!detailBodyEl) {
      return;
    }
    var hazards = Array.isArray(intel.hazards) ? intel.hazards : [];
    var hazardsList = hazards
      .filter(Boolean)
      .map(function (hazard) {
        return "<li>" + hazard + "</li>";
      })
      .join("");
    if (!hazardsList) {
      hazardsList = "<li>Signal too weak to resolve threats.</li>";
    }
    var travelNote =
      gp.planetPrompt ||
      intel.summary ||
      "A short field note from a fellow drifter will appear here once the signal steadies.";
    var galaxyNote =
      gp.galaxyPrompt ||
      "This galaxy drifts on the edge of the chart—follow the brightest lane and sketch your own map.";
    var galaxyBadge = gp.galaxyName ? '<span class="pill">' + gp.galaxyName + "</span>" : "";
    detailBodyEl.innerHTML =
      '\n      <section class="detail-section">\n        <h3>Voyager note ' +
      galaxyBadge +
      "</h3>\n        <p>" +
      travelNote +
      '</p>\n      </section>\n      <section class="detail-section">\n        <h3>Galaxy travel cue</h3>\n        <p>' +
      galaxyNote +
      '</p>\n      </section>\n      <section class="detail-section">\n        <h3>Planetary profile</h3>\n        <div class="detail-meta-grid">\n          <div class="detail-meta-card">\n            <span>Terrain</span>\n            <p>' +
      (intel.terrain || "Surface data unavailable") +
      '</p>\n          </div>\n          <div class="detail-meta-card">\n            <span>Sky</span>\n            <p>' +
      (intel.sky || "Atmospheric data pending") +
      '</p>\n          </div>\n          <div class="detail-meta-card">\n            <span>Signal</span>\n            <p>' +
      (intel.signal || "Signal obscured") +
      '</p>\n          </div>\n        </div>\n        <div class="detail-meta-card">\n          <span>Hazards</span>\n          <ul>' +
      hazardsList +
      '</ul>\n        </div>\n      </section>\n      <section class="detail-section">\n        <h3>Mission hook</h3>\n        <p>' +
      (intel.missionHook || "Awaiting mission parameters") +
      "</p>\n      </section>\n    ";
  }

  function renderPlanetIntelError(error) {
    if (detailPanel) {
      detailPanel.classList.remove("is-idle");
    }
    if (detailTitleEl) {
      detailTitleEl.textContent = "Signal disrupted";
    }
    if (detailMetaEl) {
      detailMetaEl.textContent = "Relay static is drowning the story feed.";
    }
    if (detailBodyEl) {
      var message = error && error.message ? error.message : "Unknown drift interference.";
      detailBodyEl.innerHTML =
        '<p class="atlas-detail-placeholder">Unable to decode a live response. Try another planet while the relays realign.</p><p>' +
        message +
        "</p>";
    }
  }

  function flyToGalaxyPoint(gp) {
    if (!currentScene || !currentScene.orbit) {
      return;
    }
    var orbit = currentScene.orbit;
    var target = new THREE.Vector3(gp.x, gp.y, gp.z);
    var spherical = new THREE.Spherical();
    spherical.setFromVector3(target);
    var endTheta = clamp(spherical.phi, 0.2, Math.PI - 0.2);
    var endPhi = spherical.theta - Math.PI / 2;
    var endDistance = clamp(target.length() + 1.1, 1.6, 5.5);
    var startTheta = orbit.state.theta;
    var startPhi = orbit.state.phi;
    var startDistance = orbit.state.distance;
    var duration = 1000;
    var start = performance.now();
    orbit.isAnimating = true;

    function easeInOut(t) {
      return t * t * (3 - 2 * t);
    }

    function step(now) {
      var elapsed = now - start;
      var ratio = Math.min(Math.max(elapsed / duration, 0), 1);
      var eased = easeInOut(ratio);
      orbit.state.theta = startTheta + (endTheta - startTheta) * eased;
      orbit.state.phi = startPhi + (endPhi - startPhi) * eased;
      orbit.state.distance = startDistance + (endDistance - startDistance) * eased;
      orbit.applyOrbit();
      if (ratio < 1) {
        requestAnimationFrame(step);
      } else {
        orbit.isAnimating = false;
      }
    }

    requestAnimationFrame(step);
  }

  function dispatchGalaxySelectionEvent(gp) {
    var event;
    try {
      event = new CustomEvent("atlas:galaxySelection", { detail: gp });
    } catch (_error) {
      event = document.createEvent("CustomEvent");
      event.initCustomEvent("atlas:galaxySelection", false, false, gp);
    }
    document.dispatchEvent(event);
  }

  function restoreIdleStatus() {
    if (currentGalaxyPoint) {
      return;
    }
    setStatusPillsIdle();
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
})();
