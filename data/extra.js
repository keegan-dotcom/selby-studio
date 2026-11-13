/* Government programs, known and alleged. st: confirmed | proposed | reported | alleged | forged */
window.PROGRAMS = [
  { c:"United States", n:"Project Sign", y:"1948–1949", a:"US Air Force", st:"confirmed", t:`The first official study. Its staff drafted an estimate that favoured interplanetary craft, and the Chief of Staff rejected it for lack of proof.` },
  { c:"United States", n:"Project Grudge", y:"1949–1951", a:"US Air Force", st:"confirmed", t:`Sign's successor, run on the assumption that every report had an ordinary cause.` },
  { c:"United States", n:"Project Twinkle", y:"1949–1951", a:"Air Force Cambridge Research Laboratories", st:"confirmed", t:`Cameras and spectrographs set up to catch the green fireballs over New Mexico's nuclear laboratories. It recorded almost nothing.` },
  { c:"United States", n:"Project Blue Book", y:"1952–1969", a:"US Air Force", st:"confirmed", t:`The long one. 12,618 reports, 701 left unidentified. Closed after the Condon Report said further study was not justified.` },
  { c:"United States", n:"Project Stork and Special Report 14", y:"1952–1955", a:"Battelle Memorial Institute for the Air Force", st:"confirmed", t:`A statistical study of 3,201 reports. About a fifth were rated unknown, and the best-documented reports were the most likely to stay unknown.` },
  { c:"United States", n:"The Robertson Panel", y:"1953", a:"CIA", st:"confirmed", t:`A scientific panel that recommended using mass media to strip UFOs of their mystery and watching civilian UFO groups.` },
  { c:"United States", n:"Moon Dust and Blue Fly", y:"1950s–1980s", a:"Air Force intelligence", st:"confirmed", t:`Teams assigned to recover fallen foreign space hardware. Their tasking also covered objects of unknown origin, which is why researchers keep requesting the files.` },
  { c:"United States", n:"The Condon Committee", y:"1966–1968", a:"University of Colorado, Air Force contract", st:"confirmed", t:`The independent review that ended official study. About a third of the cases in its own report stayed unexplained.` },
  { c:"United States", n:"Stargate", y:"1972–1995", a:"Army, DIA and CIA", st:"confirmed", t:`The remote viewing program. It is not a UFO program, but its scientists, Hal Puthoff among them, reappear in every later one.` },
  { c:"United States", n:"AAWSAP", y:"2008–2010", a:"Defense Intelligence Agency", st:"confirmed", t:`22 million dollars, contracted to Bigelow Aerospace. It studied military encounters and Skinwalker Ranch and commissioned 38 papers on exotic physics.` },
  { c:"United States", n:"AATIP", y:"2007–2012, end date disputed", a:"Office of the Secretary of Defense", st:"confirmed", t:`The name the New York Times made famous. Luis Elizondo says he ran it as a continuing effort on military sightings. The Pentagon disputes his role.` },
  { c:"United States", n:"Kona Blue", y:"2011", a:"Department of Homeland Security", st:"proposed", t:`A proposed special access program to carry on AAWSAP's work, including the study of any recovered material. It was rejected and declassified in 2024.` },
  { c:"United States", n:"UAP Task Force", y:"2020–2021", a:"Office of Naval Intelligence", st:"confirmed", t:`Standardised military reporting and produced the 2021 assessment with 143 unexplained cases.` },
  { c:"United States", n:"AOIMSG", y:"2021–2022", a:"Department of Defense", st:"confirmed", t:`A short-lived successor with a long name. Congress replaced it within months.` },
  { c:"United States", n:"AARO", y:"2022–now", a:"Defense Department and ODNI", st:"confirmed", t:`The All-domain Anomaly Resolution Office. More than 1,650 reports by late 2024. It says it has found no evidence of non-human technology.` },
  { c:"United States", n:"NASA UAP Independent Study", y:"2022–2023", a:"NASA", st:"confirmed", t:`Sixteen outside experts. They found no evidence of an extraterrestrial origin and asked for better data.` },
  { c:"United States", n:"PURSUE", y:"2026–now", a:"White House and Department of War", st:"confirmed", t:`The public archive of declassified UAP files, with a waiver that lets insiders speak to its staff.` },
  { c:"United States", n:"The Legacy Program", y:"1940s–now", a:"Intelligence agencies and contractors", st:"alleged", t:`The name insiders give the crash retrieval and reverse-engineering effort David Grusch described under oath. AARO says it does not exist.` },
  { c:"United States", n:"The Blue Room", y:"1947 onward", a:"Wright-Patterson Air Force Base", st:"alleged", t:`Where Roswell material is said to have gone. Senator Barry Goldwater wrote that General Curtis LeMay refused him entry and told him never to ask again.` },
  { c:"United States", n:"Project Galileo at S-4", y:"1980s", a:"Navy, by Bob Lazar's account", st:"alleged", t:`Lazar's name for the propulsion study he says he joined at Papoose Lake, alongside projects Sidekick and Looking Glass.` },
  { c:"United States", n:"Immaculate Constellation", y:"2017 onward", a:"Defense Department", st:"alleged", t:`A hidden program said to collect the highest-quality UAP imagery, described in a report entered into the Congressional Record in 2024. The Pentagon says it has no record of it.` },
  { c:"United States", n:"Off-World Technologies Division", y:"2010s", a:"Naval Surface Warfare Center, Crane", st:"alleged", t:`Named by former Green Beret Randy Anderson, who says he was shown a recovered object there. No second witness.` },
  { c:"United States", n:"Majestic 12", y:"Papers surfaced 1984", a:"None", st:"forged", t:`A supposed committee of twelve running recoveries since 1947. The FBI examined the documents and marked them bogus.` },
  { c:"United States", n:"Solar Warden", y:"1980s onward", a:"None identified", st:"alleged", t:`A secret space fleet, traced to hacker Gary McKinnon's claims and later embroidered online. Nothing supports it.` },

  { c:"United Kingdom", n:"Flying Saucer Working Party", y:"1950–1951", a:"Ministry of Defence", st:"confirmed", t:`Britain's first study, kept secret for fifty years. It concluded that all sightings were mistakes or hoaxes.` },
  { c:"United Kingdom", n:"The UFO desk", y:"1950s–2009", a:"Ministry of Defence", st:"confirmed", t:`A one-person office that logged about 12,000 public reports before closing. Its files are in the National Archives.` },
  { c:"United Kingdom", n:"Project Condign", y:"1996–2000", a:"Defence Intelligence Staff", st:"confirmed", t:`A secret four-year analysis. It accepted that unexplained aerial phenomena exist and suggested rare atmospheric plasmas.` },
  { c:"France", n:"GEPAN, SEPRA, GEIPAN", y:"1977–now", a:"CNES, the French space agency", st:"confirmed", t:`The longest-running open civilian government study. It publishes its case files, and a few percent stay unexplained after investigation.` },
  { c:"France", n:"COMETA", y:"1999", a:"Private committee of retired generals", st:"confirmed", t:`Told the president that the extraterrestrial hypothesis best explained the hardest cases.` },
  { c:"Canada", n:"Project Magnet", y:"1950–1954", a:"Department of Transport", st:"confirmed", t:`Engineer Wilbert Smith's study. His 1950 memo records being told that the US rated flying saucers more secret than the hydrogen bomb.` },
  { c:"Canada", n:"Project Second Storey", y:"1952–1954", a:"Defence Research Board", st:"confirmed", t:`A committee that met a handful of times and decided the subject did not lend itself to scientific study.` },
  { c:"Canada", n:"Sky Canada Project", y:"2022–2025", a:"Chief Science Advisor", st:"confirmed", t:`A review of how Canada handles reports. It recommended a federal service to collect and publish them.` },
  { c:"Soviet Union", n:"Setka", y:"1978–1990", a:"Academy of Sciences and Ministry of Defence", st:"confirmed", t:`Launched after a glowing object hung over Petrozavodsk in 1977. Every military unit was ordered to report anomalies. Most turned out to be rocket launches.` },
  { c:"Brazil", n:"SIOANI", y:"1969–1972", a:"Brazilian Air Force", st:"confirmed", t:`An early Air Force system for investigating sightings around São Paulo.` },
  { c:"Brazil", n:"Operação Prato", y:"1977–1978", a:"Brazilian Air Force", st:"confirmed", t:`Four months in the Amazon delta photographing lights that villagers said were attacking them. The files were released decades later.` },
  { c:"Uruguay", n:"CRIDOVNI", y:"1979–now", a:"Uruguayan Air Force", st:"confirmed", t:`One of the oldest continuously running official commissions in the world.` },
  { c:"Chile", n:"CEFAA, now SEFAA", y:"1997–now", a:"Civil aviation authority", st:"confirmed", t:`Investigates pilot reports and publishes the footage it cannot explain.` },
  { c:"Argentina", n:"CEFAe, now CIAE", y:"2011–now", a:"Argentine Air Force", st:"confirmed", t:`Reviews public reports each year and explains nearly all of them.` },
  { c:"Peru", n:"OIFAA, now DIFAA", y:"2001–now", a:"Peruvian Air Force", st:"confirmed", t:`Reactivated in 2013 after a rise in sightings.` },
  { c:"Sweden", n:"Ghost rocket committee", y:"1946", a:"Defence Staff", st:"confirmed", t:`Investigated about 2,000 reports in one summer and could not identify a source.` },
  { c:"Spain", n:"Air Force declassification", y:"1992–1999", a:"Spanish Air Force", st:"confirmed", t:`Released its sighting files from 1962 onward, case by case.` },
  { c:"Italy", n:"Air Force reporting office", y:"1978–now", a:"Italian Air Force general staff", st:"confirmed", t:`Has collected and published sighting reports since a wave in 1978.` },
  { c:"Italy", n:"Gabinetto RS/33", y:"1933", a:"Mussolini's government", st:"alleged", t:`A secret cabinet said to have studied a disc recovered at Magenta. It rests on anonymous documents.` },
  { c:"Australia", n:"RAAF investigations", y:"1950s–1996", a:"Royal Australian Air Force", st:"confirmed", t:`Handled public reports for forty years, then stopped for lack of defence value.` },
  { c:"Japan", n:"Reporting protocols and UAP league", y:"2020–now", a:"Ministry of Defense and the Diet", st:"confirmed", t:`Pilots were given procedures for encounters in 2020. A cross-party group of lawmakers formed in 2024 to push for a dedicated office.` },
  { c:"China", n:"PLA analysis task force", y:"Reported 2021", a:"People's Liberation Army", st:"reported", t:`Press reports describe a military unit using artificial intelligence to sort reports of what it calls unidentified air conditions.` },
  { c:"Russia and China", n:"Rival retrieval programs", y:"Undated", a:"Unknown", st:"alleged", t:`US insiders say adversaries hold recovered craft and that a reverse-engineering race is under way. No evidence has been made public.` }
];
window.PSTATUS = {
  confirmed:{ n:"Confirmed", c:"var(--ice)" }, proposed:{ n:"Proposed", c:"var(--wit)" }, reported:{ n:"Reported", c:"var(--myt)" }, alleged:{ n:"Alleged", c:"var(--hot)" }, forged:{ n:"Forged", c:"var(--hoax)" }
};

/* Full-bleed backgrounds, all hosted on Wikimedia Commons. [file, licence, credit] */
window.BG = {
  earth:["The Blue Marble, AS17-148-22727.jpg","PD","NASA, Apollo 17"],
  footage:["ISS-58 Ukraine and Russia nighttime view.jpg","PD","NASA"],
  start:["NASA-Apollo8-Dec24-Earthrise.jpg","PD","NASA, Apollo 8"],
  a:["ESO - Milky Way.jpg","CC BY 4.0","ESO/S. Brunier"],
  b:["Orion Nebula - Hubble 2006 mosaic 18000.jpg","PD","NASA, ESA"],
  c:["Trinity Test Fireball 16ms.jpg","PD","US Department of Energy"],
  d:["Backlit Saturn from Cassini Orbiter 2007 May 9.jpg","PD","NASA/JPL"],
  e:["ISS-65 Europe, city lights from space.jpg","PD","NASA"],
  f:["Capitol at Dusk 2.jpg","CC BY-SA 3.0","Martin Falbisoner"],
  beings:["NASA’s Webb Reveals Cosmic Cliffs, Glittering Landscape of Star Birth.jpg","PD","NASA, ESA, CSA, STScI"],
  craft:["PIA21641-Jupiter-SouthernStorms-JunoCam-cropped.jpg","PD","NASA/JPL-Caltech/SwRI"],
  origins:["Andromeda Galaxy M31 - Heic1502a Full resolution.jpg","CC BY 4.0","NASA, ESA, J. Dalcanton"],
  math:["Webb's First Deep Field.jpg","PD","NASA, ESA, CSA, STScI"],
  programs:["The Pentagon January 2008.jpg","CC BY-SA 2.0","David B. Gleason"],
  retrievals:["Groom Lake and Papoose Lake.jpg","CC BY 2.0","Doc Searls"],
  voices:["Very Large Array, 2012.jpg","CC BY 2.0","John Fowler"],
  thesis:["Pillars of Creation (NIRCam Image).jpg","PD","NASA, ESA, CSA, STScI"]
};

window.PSI = [
 {
  "y": "1972–1995",
  "k": "rec",
  "n": "Stargate: the government paid for psychics",
  "t": "Physicists Hal Puthoff and Russell Targ began remote-viewing trials at Stanford Research Institute in 1972 with CIA money. Under names like Grill Flame and Stargate, the CIA, DIA and Army kept psychic spies on the books for over twenty years, including Ingo Swann, Pat Price and Joseph McMoneagle.",
  "x": "A 1995 review for the CIA split. Statistician Jessica Utts said the effect was real. Psychologist Ray Hyman said it was not shown, and the review found no operational intelligence value. The program was shut that year."
 },
 {
  "y": "1975",
  "k": "clm",
  "n": "Remote viewing the Moon",
  "t": "In his 1998 book Penetration, Swann says a man he calls Axelrod had him view the far side of the Moon and that he saw towers, machinery and humanoid workers, then saw a craft over a lake with Axelrod's people. He says he was warned the visitors could detect viewers.",
  "x": "It rests on Swann's word alone. No document backs the Moon sessions, and the book came out more than twenty years after the events it describes."
 },
 {
  "y": "1970s–now",
  "k": "rec",
  "n": "The same names run both programs",
  "t": "Puthoff co-founded remote viewing, then his company EarthTech did contract work for the Pentagon's AAWSAP UFO program from 2008 and later joined To The Stars. Kit Green was the CIA's monitor of the SRI psychics and later worked with Stanford's Garry Nolan on UFO witnesses. Lue Elizondo writes that a Stargate veteran taught him to remote view.",
  "x": "Overlapping people do not prove overlapping phenomena. Critics read it the other way: the UFO programs were staffed by paranormal believers, which shaped what they went looking for."
 },
 {
  "y": "1983",
  "k": "rec",
  "n": "The Gateway Process",
  "t": "An Army intelligence officer, Lt. Col. Wayne McDonnell, wrote an assessment of the Monroe Institute's sound-based meditation, arguing that focused consciousness could move outside time and space. The CIA released it in 2003 and it went viral in 2023.",
  "x": "It is one officer's theory, built from the physics he read, not a test result. Nothing shows the Army used it."
 },
 {
  "y": "2008–2010",
  "k": "wit",
  "n": "The hitchhiker effect",
  "t": "In Skinwalkers at the Pentagon (2021), AAWSAP's own program manager James Lacatski and his co-authors describe staff, and later their families, reporting apparitions, orbs and poltergeist activity at home after visiting Skinwalker Ranch. The program treated it as a possible contagion and logged medical effects.",
  "x": "The accounts come from the same team that ran the study. No outside group checked them."
 },
 {
  "y": "2010s",
  "k": "wit",
  "n": "A brain built for contact",
  "t": "Garry Nolan and Kit Green scanned about a hundred people with anomalous experiences, many of them military and intelligence. They report far denser wiring between the caudate and putamen, a region tied to intuition, than in controls. Elizondo argues the same people tend to be the remote viewers and the ones the phenomenon picks.",
  "x": "The study is unpublished and the sample was not chosen at random. Nolan says the subjects' claimed abilities were never tested, and nobody knows whether the wiring came before or after the experiences."
 },
 {
  "y": "1994",
  "k": "wit",
  "n": "The space kids",
  "t": "At Ariel School in Zimbabwe, sixty-two children described a craft and thin black-eyed beings in the field at break time. Several said the beings spoke to them without words, with warnings about technology and the planet. Harvard psychiatrist John Mack interviewed them, and many tell the same story as adults.",
  "x": "Children talk to each other, and Mack's interviews came after weeks of press coverage. The 'starseed' and 'indigo child' belief that some children carry visitor souls has no evidence behind it."
 },
 {
  "y": "1980, told 2010",
  "k": "clm",
  "n": "The Rendlesham download",
  "t": "Airman Jim Penniston says he touched the craft in Rendlesham Forest and afterwards a stream of ones and zeros filled his head, which he wrote in a notebook. Decoded, it reads as coordinates for ancient sites and a phrase about 'continuation for planetary advancement'.",
  "x": "The notebook surfaced thirty years later and appears in none of his 1980 statements."
 },
 {
  "y": "2025",
  "k": "clm",
  "n": "Psionic pilots",
  "t": "Jake Barber told NewsNation that the crash-retrieval program used 'psionic' people to summon, communicate with and even steer craft, so some retrievals were invitations rather than crashes. His private team says it ran its own summoning in 2024 with a psionic member. Two veterans backed him on camera.",
  "x": "No verifiable evidence has been shown, and the footage he released is unverified. AARO says it is looking into his claims."
 },
 {
  "y": "1990–now",
  "k": "clm",
  "n": "CE-5: calling them down",
  "t": "Steven Greer teaches groups to meditate under the night sky and project an invitation, which he calls a close encounter of the fifth kind. Thousands of people have tried it and many report lights that answer.",
  "x": "The lights that answer look like satellites, aircraft and flares. Greer's own claims, like the Atacama 'alien' skeleton, have not held up."
 },
 {
  "y": "All eras",
  "k": "wit",
  "n": "Mind to mind",
  "t": "Across abduction reports from every continent, beings rarely speak. Witnesses say thoughts arrive in their heads. Mack, a Pulitzer winner, concluded the experiences were real to the people and not explained by mental illness.",
  "x": "Sleep paralysis produces paralysis, a presence and telepathic 'voices', and hypnosis can plant detail. Harvard reviewed Mack's methods in 1994 and let him keep his post."
 }
];
