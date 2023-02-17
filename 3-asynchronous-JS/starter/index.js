const fs = require("fs");
const superagent = require("superagent");

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject({ message: `Cannot find file! 🥲` });
      }
      resolve(data);
    });
  });
};

const writeFilePro = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) reject(`Could not write!`);
      resolve("success");
    });
  });
};

const getDogImg = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1, res2, res3]);
    const img = all.map((er) => er.body.message);
    console.log(img);

    await writeFilePro("dog-img.txt", img.join("\n"));
    console.log("Random dog image save to file!");
  } catch (err) {
    console.log(err.message);

    throw err;
  }
  return "2: Ready 🐶";
};

(async () => {
  try {
    console.log("1: Will get dog pic");
    const x = await getDogImg();
    console.log(x);
    console.log("3: Done!");
  } catch (err) {
    console.log("ERROR 💥");
  }
})();

/*
console.log("1: Will get dog pic");
getDogImg()
  .then((x) => {
    console.log(x);
    console.log("3: Done!");
  })
  .catch((err) => {
    console.log("ERROR 💥");
  });
*/
/*
readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro("dog-img.txt", res.body.message);
  })
  .then(() => {
    console.log("Random dog image save to file!");
  })
  .catch((err) => {
    console.log(err.message);
  });
*/
