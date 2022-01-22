import {Shopify} from '@shopify/shopify-api';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const accesstoken = process.env.ACCESS_TOKEN;
console.log(accesstoken);




addCodeInThemeFile('aowlestore1.myshopify.com', accesstoken);


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

    /**
     * get all assets metadata of publihed theme
     * @param {object of published theme} dataTheme 
     */
    async function getAllData(dataTheme) { 
      var lol = await client.get({
        path: `themes/${dataTheme.body.themes[0].id}/assets`  
      });
      return [lol, dataTheme];
    }


    getAllData(dataTheme).then(
     async (data) => {
        console.log("total no of assets in theme " + data[0].body.assets.length);

        var dataThemeID = data[1].body.themes[0].id; 

        let themePath = `./themes/${shop}_${dataThemeID}_${new Date().getTime()}`;
 
        fs.mkdir( themePath ,function(){  // create folder for theme download
          console.log("root folder has been created");
        });


        var i =0;

          function recursive(i){
            
            if( i == data[0].body.assets.length) return ;
            console.log(i);

            var element = data[0].body.assets[i];
  
            
  
            let obj = {
              path: `themes/${dataThemeID}/assets`,
              query: { "asset[key]": element.key},
            }
  
            console.log(obj);
  
            client.get(obj).then(
              (data1) => {
                let totalPath = element.key.split("/");

                let fileName = totalPath.splice(-1,1); // extract file name from total path
                let folderPath = themePath + '/' + totalPath.join("/");
                let filePath = folderPath + '/' + fileName
  
    

                if (!fs.existsSync(folderPath)) {
                  fs.mkdir(folderPath,{ recursive: true },function(){
                    fs.writeFileSync(filePath,data1.body.asset.value);
                  });
                }
                else{
                  fs.writeFileSync(filePath,data1.body.asset.value);
                }

                /**
                 * recheck file exist
                 */
                try {
                  if (fs.existsSync(filePath)) {
                    console.log(filePath);
                  }
                  else{
                    console.log("file not exist" + filePath);
                  }
                } catch(err) {
                  console.log("file not exist" + filePath);
                  console.error(err);
                }
  
                recursive(++i);
                return;
  
              },
              (e) => {
                console.log(e);
                setTimeout(() => {
                  recursive(i);
                }, 1000);
                return;
              }
            )
          }

          await recursive(i);

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
