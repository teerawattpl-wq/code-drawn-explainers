// The film's own tables, loaded before the acts: the size of the puppets on screen and who
// is who among the supporting cast.
seed(11);
const SC = 0.86;                                                          // the main puppet's usual size on screen
// Who is who among the supporting cast (see puppet.js): a head, a body, and what they wear.
const WHO = {
  boy: { head: "boy", body: "blue", shoe: 150 }, girl: { head: "girl", body: "coral", shoe: 60 }, curly: { head: "curly", body: "green", shoe: 200 },
  girl2: { head: "girl", body: "green", shoe: 110 }, boy2: { head: "boy", body: "coral", shoe: 240 },
  teacher: { head: "teacher", body: "teacher", shoe: 80 }, seller: { head: "auntie", body: "apron", shoe: 150 },
  clerk: { head: "man", body: "office", shoe: 200 }, staff2: { head: "teacher", body: "office", shoe: 60 }, staff3: { head: "auntie", body: "blue", shoe: 110 },
  friend: { head: "man", body: "blue", shoe: 240 }, builder: { head: "man", body: "vest", hat: "hat-orange", shoe: 200 },
  doctor: { head: "teacher", body: "doctor", hat: "mirror", neck: "stethoscope", shoe: 150 },
  engineer: { body: "vest", hat: "hat-yellow" }, chef: { hat: "chef" }, party: { hat: "party" },
  partyfriend: { head: "girl", body: "coral", hat: "party", shoe: 60 },                           // the main puppet at work: its own head under a hard hat
};
const KID = 0.56;                                                         // a child's size on screen (the main puppet is SC)
