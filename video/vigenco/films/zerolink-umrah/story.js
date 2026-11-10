// ZeroLink for Umrah & Hajj: one-go story for live product demos and pitching.
// Step: [chapter index, screen, tap x, tap y (null = no tap), headline, detail, feature chip, hold seconds]
window.STORY = {
 intro: [
  ['One group of 45 pilgrims.', 'One guide. Millions of people around them.'],
  ['In the crowd, mobile data crawls', 'and roaming is expensive. Losing someone is easy.'],
 ],
 chapters: ['Before departure', 'Arrival in Makkah', 'Masjidil Haram', 'After Isha', 'A pilgrim is missing', 'Emergency', 'Bigger groups'],
 steps: [
  [0,'7-isi-nama-pertama-kali',.784,.559,'Every pilgrim installs ZeroLink','Free, with no account. Each pilgrim types the name the group will see.','Setup'],
  [0,'18-kartu-medis',null,null,'A medical card for each pilgrim','Blood type, allergies, medicines and a family contact. Shared with the group only when help is needed.','Medical card'],
  [0,'40-mode-lansia',null,null,'Simple mode for elderly pilgrims','Three big buttons: SOS, I’m safe and Hold to talk. Nothing else to learn.','Simple mode'],
  [1,'53-qr-saya',null,null,'Join the group with a QR code','Pilgrims scan a code to join. No SIM card, no data plan, no internet.','Join by QR'],
  [1,'2-grup-dan-chat',.911,.965,'The guide talks, everyone hears','Hold the button and speak. Every phone in the group hears it live, like a walkie-talkie.','Push-to-talk',1.6],
  [2,'10-tulis-pengumuman',.784,.568,'One announcement for the whole group','Bus times, meeting places, reminders. Written once, delivered to every phone.','Announcement'],
  [2,'21-terkirim-dan-pengumuman-terlewat',null,null,'See who received it','Each announcement shows who has it. A pilgrim who was out of range gets it on return.','Delivery check'],
  [2,'25-pilih-titik-kumpul-di-peta',.86,.965,'Pin the meeting point','The guide sets Gate 79 on the offline map, downloaded before the trip.','Meeting point'],
  [2,'24-titik-kumpul-di-kompas',null,null,'Everyone is guided to the gate','The compass shows the distance and direction to the meeting point, and who has arrived.','Compass'],
  [3,'38-absen',.2,.73,'Roll call in one tap','Every pilgrim answers Safe, Need help or Injured.','Roll call'],
  [3,'39-hasil-absen',null,null,'Know at once who is missing','The guide sees who is safe, who needs help and who has not answered.','Roll call'],
  [4,'42-cari-keluarga',null,null,'A search card for the missing pilgrim','Her description travels from phone to phone to every group the phones join.','Find family'],
  [4,'43-daftar-pencarian',.496,.686,'Found, and everyone knows','When someone spots her, one tap tells every phone she is safe.','Find family'],
  [5,'8-konfirmasi-sos-dan-sms',.754,.621,'SOS during Sa’i','A pilgrim feels faint in the heat. One tap sends SOS to the whole group.','SOS'],
  [5,'19-sos-dengan-info-medis',null,null,'The alert carries what responders need','Distance, direction, battery, blood type and conditions arrive on every phone.','SOS + medical card'],
  [5,'5-kompas',null,null,'The guide is led straight to her','The compass points the way, with the distance left.','Compass'],
  [5,'35-panduan-banjir',null,null,'First aid, offline','A step-by-step heatstroke guide while help is on the way.','Offline guide'],
  [6,'48-grup-lewat-jembatan',null,null,'Two buses, one conversation','A phone in the middle bridges two groups, such as two buses or two hotel floors.','Bridge'],
 ],
 end: ['ZeroLink for Umrah & Hajj', 'Keep every pilgrim connected. No internet needed.'],
};
