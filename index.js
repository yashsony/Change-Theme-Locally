import {Shopify} from '@shopify/shopify-api';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const accesstoken = process.env.ACCESS_TOKEN;
console.log(accesstoken);




addCodeInThemeFile('aowlestore1.myshopify.com', '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');


async function addCodeInThemeFile(shop, accessToken) {
  try {
    const client = new Shopify.Clients.Rest(shop, accessToken);

    /**
     * we are getting the published theme
     */
    const dataTheme = await client.get({  
      path: "themes",
      query: { role: "main" },
    });

    async function getAllData(dataTheme) {
      var lol = await client.get({
        path: `themes/${dataTheme.body.themes[0].id}/assets`
      });
      return [lol, dataTheme];
    }

    getAllData(dataTheme).then(
     async (data) => {
        console.log(data[0].body.assets.length);
        var dataThemeID = data[1].body.themes[0].id;

        let themePath = `./themes/${shop}_${dataThemeID}`;

        fs.mkdir( themePath ,function(){
          console.log("root folder has been created");
        });


        var i =0;
        setInterval(() => {
          if(i == data[0].body.assets.length) return;
          console.log(i);

          
          var element = data[0].body.assets[i++];

          

          let obj = {
            path: `themes/${dataThemeID}/assets`,
            query: { "asset[key]": element.key},
          }
          console.log(obj);

          client.get(obj).then(
            (data1) => {
              let folderName = themePath + '/' + element.key.split("/")[0];
              let fileName = folderName + '/' + element.key.split("/")[1];


              if (!fs.existsSync(folderName)) {
                fs.mkdir(folderName,function(){
                  fs.writeFileSync(fileName,data1.body.asset.value);
                });
              }
              else{
                fs.writeFileSync(fileName,data1.body.asset.value);
              }



            },
            (e) => console.log(e)
          )
        }, 600);

      },
      (e) => {
        console.log(e);
      }
    )












    // need to work on response when something went wrong

    // getData(dataTheme).then(
    //   (data) => {
    //     // const data1 = client.put({
    //     //   path: `themes/${data[1].body.themes[0].id}/assets`,
    //     //   data: {
    //     //     asset: {
    //     //       key: "layout/theme.liquid",
    //     //       value: `${data[0].body.asset.value}`, //add your logic to edit code
    //     //     },
    //     //   },
    //     //   type: DataType.JSON,
    //     // });
    //     // setTimeout(() => {
    //     //   console.log("Theme Code has been updated");
    //     // }, 5000);
    //     console.log(data[0].body.asset.value);
    //   },
    //   (e) => {
    //     throw e;
    //   }
    // );



  } catch (err) {
    return err;
  }
  return true;
}