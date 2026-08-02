insert into public.districts(name_en,name_as) values
('Baksa','বাক্সা'),('Barpeta','বৰপেটা'),('Biswanath','বিশ্বনাথ'),('Bongaigaon','বঙাইগাঁও'),
('Bajali','বজালী'),('Cachar','কাছাৰ'),('Charaideo','চৰাইদেউ'),('Chirang','চিৰাং'),
('Darrang','দৰং'),('Dhemaji','ধেমাজি'),('Dhubri','ধুবুৰী'),('Dibrugarh','ডিব্ৰুগড়'),
('Dima Hasao','ডিমা হাছাও'),('Goalpara','গোৱালপাৰা'),('Golaghat','গোলাঘাট'),
('Hailakandi','হাইলাকান্দি'),('Hojai','হোজাই'),('Jorhat','যোৰহাট'),('Kamrup','কামৰূপ'),
('Kamrup Metropolitan','কামৰূপ মহানগৰ'),('Karbi Anglong','কাৰ্বি আংলং'),
('Karimganj','কৰিমগঞ্জ'),('Kokrajhar','কোকৰাঝাৰ'),('Lakhimpur','লক্ষীমপুৰ'),
('Majuli','মাজুলী'),('Morigaon','মৰিগাঁও'),('Nagaon','নগাঁও'),('Nalbari','নলবাৰী'),
('Sivasagar','শিৱসাগৰ'),('Sonitpur','শোণিতপুৰ'),
('South Salmara-Mancachar','দক্ষিণ শালমাৰা-মানকাচৰ'),('Tinsukia','তিনিচুকীয়া'),
('Tamulpur','তামুলপুৰ'),('Udalguri','ওদালগুৰি'),('West Karbi Anglong','পশ্চিম কাৰ্বি আংলং')
on conflict(name_en) do update set name_as=excluded.name_as;
