-- Fix broken (404) image URLs and replace generic portraits with Moroccan artisan scenes

-- Categories
UPDATE Category SET image = REPLACE(image, 'photo-1558618666-fcd25c85f82e', 'photo-1759523146335-0069847ceb16') WHERE image LIKE '%photo-1558618666%';
UPDATE Category SET image = REPLACE(image, 'photo-1513519245088-0e1292e5c6d3', 'photo-1760727467316-4c190481b4d1') WHERE image LIKE '%photo-1513519245088%';

-- Products: wood sculpture
UPDATE Product SET images = REPLACE(images, 'photo-1558618666-fcd25c85f82e', 'photo-1759523146335-0069847ceb16') WHERE images LIKE '%photo-1558618666%';
-- Products: lanterns
UPDATE Product SET images = REPLACE(images, 'photo-1513519245088-0e1292e5c6d3', 'photo-1760727467316-4c190481b4d1') WHERE images LIKE '%photo-1513519245088%';
-- Products: pottery (shared dead URL -> clay pots, then give the vase the potter-wheel shot)
UPDATE Product SET images = REPLACE(images, 'photo-1578749556935-417cdd4086c7', 'photo-1771148885308-7cbae216fb10') WHERE images LIKE '%photo-1578749556935%';
UPDATE Product SET images = REPLACE(images, 'https://images.unsplash.com/photo-1771148885308-7cbae216fb10?w=600', 'https://plus.unsplash.com/premium_photo-1663040237172-c8974380a5d6?w=600') WHERE slug = 'vase-ceramique-berbere';
-- Products: woven items (shared dead URL -> loom, then give the tray the souk wares shot)
UPDATE Product SET images = REPLACE(images, 'photo-1605218427368-35b019b8a394', 'photo-1767390552768-6703f91c2518') WHERE images LIKE '%photo-1605218427368%';
UPDATE Product SET images = REPLACE(images, 'photo-1767390552768-6703f91c2518', 'photo-1753740023014-143ab3536662') WHERE slug = 'plateau-decoratif';
-- Products: babouches
UPDATE Product SET images = REPLACE(images, 'photo-1549289525-5c3c8fb5b8a7', 'photo-1777980808039-c8be538797f0') WHERE images LIKE '%photo-1549289525%';

-- Artisans: specialty-matched craft scenes
UPDATE Artisan SET image = 'https://plus.unsplash.com/premium_photo-1663040237172-c8974380a5d6?w=800' WHERE slug = 'fatima-zahra';
UPDATE Artisan SET image = 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800' WHERE slug = 'ahmed-benkiran';
UPDATE Artisan SET image = 'https://images.unsplash.com/photo-1745837893977-34f76b11f644?w=800' WHERE slug = 'youssef-el-amrani';
UPDATE Artisan SET image = 'https://images.unsplash.com/photo-1767390552768-6703f91c2518?w=800' WHERE slug = 'aicha-bennani';
UPDATE Artisan SET image = 'https://images.unsplash.com/photo-1759523146335-0069847ceb16?w=800' WHERE slug = 'mohamed-idrissi';

-- Stories: match article topics
UPDATE Story SET image = 'https://plus.unsplash.com/premium_photo-1663040237172-c8974380a5d6?w=800' WHERE slug = 'portrait-fatima-zahra';
UPDATE Story SET image = 'https://images.unsplash.com/photo-1745837893977-34f76b11f644?w=800' WHERE slug = 'cuir-fes-richesse';
