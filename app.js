const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
var posTagger = require("wink-pos-tagger");
var keyword_analyzer = require("keyword-analyzer");
const fs = require("fs");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const jsonfile = require("jsonfile");
const lineReader = require("line-reader");
var keyword_extractor = require("keyword-extractor");
const XMLExtract = require("xml-extract");

var utilisateurs;
const users = [];
app.use(bodyParser.urlencoded({ extended: true }));

jsonfile.readFile("users.json", function (err, obj) {
  if (err) console.error(err);
  users.push(obj);
  utilisateurs = obj;
  const initializePassport = require("./passport-config");
  initializePassport(
    passport,
    (email) => utilisateurs.utilisateurs.find((user) => user.email === email),
    (id) => utilisateurs.utilisateurs.find((user) => user.id === id)
  );
});

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: "10",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name, niveau: req.user.nivExp });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let data = {
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      nivExp: req.body.niv,
      requetes: [],
    };
    utilisateurs.utilisateurs.push(data);
    // console.log(data);

    let json = JSON.stringify(utilisateurs, null, 2);
    fs.writeFileSync("users.json", json, "utf8", () => console.log("saved!"));

    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

// end login-registration

// css js
app.use(express.static(__dirname + "/public"));
// FONCTIONS POUR LE NIVEAU DEBUTANT
// FONCTIONS POUR LE NIVEAU DEBUTANT
// FONCTIONS POUR LE NIVEAU DEBUTANT
// FONCTIONS POUR LE NIVEAU DEBUTANT
// FONCTIONS POUR LE NIVEAU DEBUTANT
// FONCTIONS POUR LE NIVEAU DEBUTANT
// FONCTIONS POUR LE NIVEAU DEBUTANT

// FONCTIONS POUR LE NIVEAU INTERMEDIAIRE
// FONCTIONS POUR LE NIVEAU INTERMEDIAIRE
// FONCTIONS POUR LE NIVEAU INTERMEDIAIRE
// FONCTIONS POUR LE NIVEAU INTERMEDIAIRE
// FONCTIONS POUR LE NIVEAU INTERMEDIAIRE
// FONCTIONS POUR LE NIVEAU INTERMEDIAIRE
// FONCTIONS POUR LE NIVEAU INTERMEDIAIRE
// FONCTIONS POUR LE NIVEAU INTERMEDIAIRE
// FONCTIONS POUR LE NIVEAU INTERMEDIAIRE
// FONCTIONS POUR LE NIVEAU INTERMEDIAIRE
// FONCTIONS POUR LE NIVEAU INTERMEDIAIRE

function getLemma(requete) {
  //fonction ta3tik tableau racines el mots li mawjoudin f requete initiale

  var tagger = posTagger();

  var analyse = tagger.tagSentence(requete); //ta3ti kal objet ba3d l'analyse eli fih barcha attributs
  var lemmatized = []; //tableau bech n7ot fih el lemma

  //fonction win nal9a lemma n7otha f tableau
  analyse.forEach((element) => {
    if (element.lemma) {
      lemmatized.push(element.lemma);
    }
  });
  return lemmatized;
}

const getTermeApi = async (url) => {
  //fonction traja3lek terme medical mel api mesh ki ta3teha url

  const response = await fetch(url);
  const json = await response.json();
  return json;
};

async function getTermes(lemmatized) {
  //fonction ta3tik tableau termes medicaux ki ta3teha tableau mta3 les racines de mots de la requete initiale

  let trouve = false; //ta3mel beha test ken l9it termes medicaux wala le
  var urlmesh = "https://id.nlm.nih.gov/mesh/lookup/term?limit=3&label=";
  var termes = []; //tableau fih termes
  if (lemmatized == 0) {
    return termes;
  }
  // njarbou mots composés bou 3
  else {
    if (lemmatized.length > 2) {
      var i = 0;
      do {
        //    await https.get(urlmesh+lemmatized[i]+" "+lemmatized[i+1]+" "+lemmatized[i+2]+ "&match=contains", function(response){

        // response.on("data", function(data){
        // var terme =(JSON.parse(data));
        let terme = await getTermeApi(
          urlmesh +
            lemmatized[i] +
            " " +
            lemmatized[i + 1] +
            " " +
            lemmatized[i + 2] +
            "&match=exact"
        );
        if (terme.length > 0) {
          trouve = true; //ken trouve true ma ya3malch mots composés bou zouz 5ater l9ina fel 3

          terme.forEach((element) => {
            termes.push(element.label);
          });
        } else {
          let termeContain = await getTermeApi(
            urlmesh +
              lemmatized[i] +
              " " +
              lemmatized[i + 1] +
              " " +
              lemmatized[i + 2] +
              "&match=contains"
          );
          if (termeContain.length > 0) {
            trouve = true; //ken trouve true ma ya3malch mots composés bou zouz 5ater l9ina fel 3

            termeContain.forEach((element) => {
              termes.push(element.label);
            });
          }
        }

        // })
        // })
        i++;
      } while (i < lemmatized.length - 2);
    }
    // njarbou mots composés bou zouz ken bou 3 ma mchech

    if ((trouve == false && lemmatized.length > 2) || lemmatized.length == 2) {
      var j = 0;

      do {
        const terme = await getTermeApi(
          urlmesh + lemmatized[j] + " " + lemmatized[j + 1] + "&match=exact"
        );
        if (terme.length > 0) {
          trouve = true;

          terme.forEach((element) => {
            termes.push(element.label);
          });
        } else {
          let termeContain = await getTermeApi(
            urlmesh +
              lemmatized[j] +
              " " +
              lemmatized[j + 1] +
              "&match=contains"
          );
          if (termeContain.length > 0) {
            trouve = true; //ken trouve true ma ya3malch mots composés bou zouz 5ater l9ina fel 3

            termeContain.forEach((element) => {
              termes.push(element.label);
            });
          }
        }

        j++;
      } while (j < lemmatized.length - 1);
    }
    //njarbou el kelmet simples ken bou zouz ma mchech
    if (trouve == false) {
      var k = 0;
      do {
        const terme = await getTermeApi(
          urlmesh + lemmatized[k] + "&match=exact"
        );
        if (terme.length > 0) {
          trouve = true;

          terme.forEach((element) => {
            termes.push(element.label);
          });
        } else {
          let termeContain = await getTermeApi(
            urlmesh + lemmatized[k] + "&match=contains"
          );
          if (termeContain.length > 0) {
            trouve = true; //ken trouve true ma ya3malch mots composés bou zouz 5ater l9ina fel 3

            termeContain.forEach((element) => {
              termes.push(element.label);
            });
          }
        }

        k++;
      } while (k < lemmatized.length);
    }
    return termes;
  }
}

const getNomArticleApi = async (terme) => {
  //fonction tjiblek esm el article men api wikipedia ki ta3teha terme medical

  let url1 =
    "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + terme;
  const response = await fetch(url1);
  const json = await response.json();
  return json[1][0];
};

const getArticleApi = async (nomArticle) => {
  //fonction tjiblek el article men api wikipedia ki ta3teha esm l'article

  let url2 =
    "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&titles=" +
    nomArticle +
    "&explaintext=true";
  const response = await fetch(url2);
  const json = await response.json();
  var article = json.query.pages[Object.keys(json.query.pages)].extract;
  return article;
};

async function getArticle(terme) {
  //fonction traja3lek article ki ta3teha el terme

  let nomArticle = await getNomArticleApi(terme);
  let article = await getArticleApi(nomArticle);
  return article;
}

async function getArticles(termes) {
  // fonction tjib tableau mta3 articles ki ta3teha el tableau mta3 termes
  let articles = [];
  i = 0;
  do {
    let article = await getArticle(termes[i]);
    articles.push(article);
    i++;
  } while (i <= termes.length);
  return articles;
}

function getMotsFrequents(articles) {
  //fonction extraire les mots frequents des articles, t7ot l'articles lkol fi chaine wa7da w te5dem 3lehom
  var articleTotal = "";
  articles.forEach((element) => {
    articleTotal = articleTotal + element;
  });
  // console.log(articleTotal);
  return keyword_analyzer.wrest(articleTotal, {
    limit: 10,
    stopWords: ["undefined", "Undefined", "variable", "function"],
  });
}

function filtrer(tableau) {
  var tabFinal = [];
  var temp = [];
  tableau.forEach((element) => {
    element.replace(",", "");
    temp = element.split(" ");
    tabFinal = [...tabFinal, ...temp];
  });

  return tabFinal;
}

function reformulation(requete, freq) {
  //fonction reformulation requete
  let requeteFinale = requete;
  freq.forEach((element) => {
    if (requeteFinale.toLowerCase().includes(element.toLowerCase()) === false) {
      requeteFinale = requeteFinale + " " + element;
    }
  });
  if (requeteFinale.length > requete.length) {
    return requeteFinale;
  } else {
    return requete;
  }
}

// FONCTIONS POUR LE NIVEAU EXPERT
// FONCTIONS POUR LE NIVEAU EXPERT
// FONCTIONS POUR LE NIVEAU EXPERT
// FONCTIONS POUR LE NIVEAU EXPERT
// FONCTIONS POUR LE NIVEAU EXPERT
// FONCTIONS POUR LE NIVEAU EXPERT
// FONCTIONS POUR LE NIVEAU EXPERT
// FONCTIONS POUR LE NIVEAU EXPERT
// FONCTIONS POUR LE NIVEAU EXPERT
// FONCTIONS POUR LE NIVEAU EXPERT
// FONCTIONS POUR LE NIVEAU EXPERT
// FONCTIONS POUR LE NIVEAU EXPERT

var readTextFile = require("read-text-file");

function getParRegex(recherche) {
  //retourner tableau contenant les ligne où existe le parametre entré
  let expression = ".*#abc.*\\b";
  let newEx = expression.replace("#abc", recherche);
  let REGEX = new RegExp(newEx, "g");

  return contents.match(REGEX);
}

const contents = readTextFile.readSync("meshTree.txt");

function getTabSansOccurences(matrice) {
  //tna7i l'occurences li mawjoudin fel matrice w t7ot lbe9i f tab

  let tabTotal = [];
  matrice.forEach((element) => {
    element.forEach((elt) => {
      if (tabTotal.indexOf(elt) == -1) {
        tabTotal.push(elt);
      }
    });
  });
  return tabTotal;
}

function rechercherTermesTree(termes) {
  //retourne le tableau des termes existants dans l'arbre

  let tab = [];
  let tabTotal = [];
  termes.forEach((element) => {
    tab = getParRegex(element);
    if (tab != null) {
      tab.forEach((elt) => {
        if (getLabel(elt) == element && tabTotal.indexOf(elt) == -1) {
          tabTotal.push(elt);
        }
      });
    }
  });

  return tabTotal;
}

function getCode(term) {
  //te5ou lcode men ligne ex "A02.513.514.100                Anterior Cruciate Ligament" traja3 A02.513.514.100
  let i = 0;
  let code = "";
  while (term[i] != " ") {
    code = code + term[i];
    i++;
  }
  return code;
}

function getLabel(term) {
  //te5ou el label men ligne ex "A02.513.514.100          Anterior Cruciate Ligament" traja3 Anterior Cruciate Ligament
  let code = getCode(term);
  term = term.replace(code, "");
  term = term.trim();
  return term;
}

function getFilles(code) {
  let filles = [];
  let result = [];
  filles = getParRegex(code);
  if (filles != []) {
    filles.forEach((element) => {
      if (getCode(element).length <= code.length + 4) {
        result.push(getLabel(element));
      }
    });
  }
  return result;
}

//si getFilles(code) ==[]
function getMereSoeurs(code) {
  let codeMere = code.slice(0, code.length - 4);
  let result = [];

  mereSoeurs = getParRegex(codeMere);
  mereSoeurs.forEach((element) => {
    if (
      getCode(element).length <= code.length &&
      getCode(element).length >= codeMere.length
    ) {
      result.push(getLabel(element));
    }
  });
  return result;
}

function getKolChay(tabTotal) {
  let code;
  let matrice = [];
  let tabTermesGlobal = [];
  let temp = [];
  tabTotal.forEach((element) => {
    code = getCode(element);
    temp = getFilles(code);
    if (temp.length == 1) {
      matrice.push(getMereSoeurs(code));
    } else {
      matrice.push(temp);
    }
    // console.log(matrice);
  });
  tabTermesGlobal = getTabSansOccurences(matrice);
  return tabTermesGlobal;
}

//FONCTIONS PRINCIPALES
//FONCTIONS PRINCIPALES
//FONCTIONS PRINCIPALES
//FONCTIONS PRINCIPALES
//FONCTIONS PRINCIPALES
//FONCTIONS PRINCIPALES
//FONCTIONS PRINCIPALES
//FONCTIONS PRINCIPALES
//FONCTIONS PRINCIPALES
//FONCTIONS PRINCIPALES

app.post("/debutant", checkAuthenticated, async (req, res) => {
  let requeteFinale = req.body.requeteDebutant;

  let users = utilisateurs; //nhot tableau utilisateur f wost tableau users
  for (var i = 0; i < users.utilisateurs.length; i++) {
    if (users.utilisateurs[i].id === req.user.id) {
      users.utilisateurs[i].requetes.push(requeteFinale);
      let json = JSON.stringify(users, null, 2);
      fs.writeFile("users.json", json, "utf8", () => console.log("saved!"));
    }
  }

  lineReader.eachLine("indexniv1.txt", function (line) {
    var extraction_result = keyword_extractor.extract(line, {
      language: "english",
      remove_digits: false,
      return_changed_case: true,
      remove_duplicates: false,
    });
    let indexArray = [];
    indexArray = extraction_result;
    console.log(extraction_result);
    res.render("resDebutant.ejs", {
      query: requeteFinale,
      index: indexArray,
    });
  });
});

app.post("/intermidiare", checkAuthenticated, async (req, res, next) => {
  try {
    var requete = req.body.requete; //tjib eli tekteb fel input
    var lemmatized = getLemma(requete); // les racines des mots de la requete initiale

    // console.log(lemmatized);
    var termes = await getTermes(lemmatized); //les termes medicaux
    console.log(termes);
    var articles = await getArticles(termes); //les articles wikipedia
    var freq = getMotsFrequents(articles); //les mots frequents des articles
    var requeteFinale = reformulation(requete, freq); //requete reformulée
    console.log(requeteFinale);
  } catch (err) {
    next("no keywords to add from wikipedia, same request : " + requete);
  }

  res.render("resIntremidiaire.ejs", {
    query1: requeteFinale,
    indexes: indexArrayNiv2,
  });
});

const requests = readTextFile.readSync(
  "indexes/index__niv2/requests__niv2.txt"
);
const result = readTextFile.readSync("indexes/index__niv2/res__niv2.txt");
let indexArrayNiv2 = [];

app.post("/expert", checkAuthenticated, async (req, res) => {
  var requete = req.body.requeteExpert; //tjib eli tekteb fel input
  var lemmatized = getLemma(requete); // les racines des mots de la requete initiale

  // console.log(lemmatized);
  var termes = await getTermes(lemmatized); //les termes medicaux
  // console.log(termes);
  var tabTotal = rechercherTermesTree(termes);
  console.log(tabTotal);
  var kolChay = getKolChay(tabTotal);
  var termesFinal = filtrer(kolChay);
  console.log(termesFinal);
  var requeteFinale = reformulation(requete, termesFinal); //requete reformulée
  // console.log(requeteFinale);
  res.render("resExpert.ejs", { query: requeteFinale });
});

app.listen(3000, function () {
  console.log("server is on port 3000");
});
