const raw_input=require('readline-sync').question;
const baseUrl="http://saral.navgurukul.org/api/courses"


function getFirstApi(url){
    const axios = require('axios')
    var response=axios.get(url)
    return response
}


function getRequests(){
    var mainData;
    var input;
    var exerciseId;

    var firstData=getFirstApi(baseUrl)

    var promise1 = new Promise(function(resolve,reject){
        resolve(firstData)

        reject("thair is error")// console.log(firstData);

    }
    );
    ids_data=[];
    promise1.then(function(url){
        var availableCourse=url.data["availableCourses"];
        for (var i in availableCourse){

            var courseName=availableCourse[i]["name"];
            courseId=availableCourse[i]["id"];
            ids_data.push(courseId)

            console.log("courses:",i, courseName ,courseId)
        }return ids_data;
    })
        .then((ids_data) =>{
            var userInput=raw_input("enter no which course you want");
            var particularId=ids_data[userInput];
            console.log(particularId);

            secondUrl=baseUrl+"/"+particularId+"/"+"exercises";
            var exercise_data=getFirstApi(secondUrl)
            return exercise_data
        })
            .then((exercises) =>{
                dict={};
                slug_list=[];
                exercisesIdData=[]
                console.log("                                       -EXERCISES-                                   ")
                var exercise=exercises["data"]["data"];
                for (var i in exercise){
                    exerciseName=exercise[i]["name"];
                    exerciseId=exercise[i]["id"];
                    exerSlug=exercise[i]["slug"]
                    slug_list.push(exerSlug)
                    exercisesIdData.push(exerciseId)
                    console.log(i,exerciseName,exerciseId)
                    var childExercise=exercise[i]["childExercises"]
                    for (var j in childExercise){
                        console.log("              ",j,childExercise[j]["name"])

                    }
                }dict["ids"]=exercisesIdData;
                dict["exerciseData"]=exercise;
                dict["slugs"]=slug_list;
                return dict;
                })
                .then((dictData) =>{
                    console.log("                                      *********** Particular Exercise**************")
                    console.log(" ")

                    chooseExercise=raw_input("enter no which exercise you want");
                    input=chooseExercise;
                    exer=dictData["exerciseData"];

                    exerData=exer[chooseExercise]["name"];
                    console.log(exerData);
                    child_Slug=[];

                    userChildData=exer[chooseExercise]["childExercises"];

                    for (var j in userChildData){
                        console.log("              ",userChildData[j]["name"])
                        child_Slug.push(userChildData[j]["slug"]);

                        }dictData["childSlugs"]=child_Slug;

                        particularId=dictData["ids"]

                        particularSlug=dictData["slugs"]
                        id=particularId[chooseExercise]
                        exerciseId=id;
                        slug=particularSlug[chooseExercise]
                        thirdUrl=baseUrl+"/"+id+"/exercise"+"/getBySlug?slug="+slug
                        dictData["url"]=thirdUrl
                        return dictData;
                })
                .then((dictData) =>{
                    url=dictData["url"]
                    contantData=getFirstApi(url)
                    dictData["response3"]=contantData;
                    mainData=dictData;
                    return dictData
                })
                .then((Data) =>{
                    res3=Data["response3"];
                    return res3;
                })

                    .then((contentData) =>{
                        console.log(contentData["data"]["content"]);
                    

                        child_data=mainData["exerciseData"][input]["childExercises"]
                       
                        // console.log(child_data)
                        for (var i in child_data){
                            console.log("                ",i,child_data[i]["name"]);
                        
                        }                            
                        user_choice=raw_input("enter  no which child exercise content you want");
                        partucular_slug=mainData["childSlugs"][user_choice]

                        childUrl=baseUrl+"/"+exerciseId+"/exercise/getBySlug?slug="+partucular_slug

                        childDataContent=getFirstApi(childUrl);
                        return childDataContent;
                    
                    })
                    .then((content) =>{
                        console.log(content["data"]["content"]);

                }).catch((content) =>{
            console.log("This exercise has no value")
        });
};
getRequests();