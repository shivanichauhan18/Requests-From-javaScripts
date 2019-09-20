const axios = require('axios');
const async = require("async")
const raw_input = require('readline-sync').question;
const BASE_URL = 'http://saral.navgurukul.org/api/courses'
const slug_list = []

function get(data) {
    let data1 = axios.get(data)
    return data1
}

var response = get(BASE_URL)
    .then((resp) => {
        const availableCourse = (resp.data.availableCourses)
        let course_id_list = []
        console.log('@@@@@@@@@@@@------ -WELCOME TO SARAL- ------@@@@@@@@@@@@')
        for (let i = 0; i < availableCourse.length; i++) {
            let course = availableCourse[i]

            console.log(i, course.name)
            course_id_list.push(course.id)

        }
        return course_id_list

    }).then((course_id) => {

        var input = raw_input('enter your id')
        return course_id[input]

    })

    .then((course_id) => {


        return new Promise((resolve, reject) => {
            let exercise = BASE_URL + `/${course_id}/exercises`
            let result = get(exercise)
                .then(function (result) {
                    let all_exercise = (result.data.data)
                    let count = 1;
                    for (let i = 0; i < all_exercise.length; i++) {
                        const exercise = all_exercise[i];
                        let exercise_name = (exercise.name)
                        slug_list.push(exercise.slug)
                        console.log(count, '. ', exercise_name, "parantal")
                        count++;

                        for (let i = 0; i < exercise.childExercises.length; i++) {
                            const child_exercise = exercise.childExercises[i];
                            let child_exercise_name = (child_exercise.name)
                            slug_list.push(child_exercise.slug)
                            console.log(count, '. ', child_exercise_name, "chils")
                            count++;
                        }
                    }

                    return slug_list
                })
                .then((slug_list) => {
                    var slug_input = raw_input('enter your id')
                    return slug_list[slug_input - 1]
                })
                .then((slug_input) => {

                    const slug_url = `http://saral.navgurukul.org/api/courses/` + course_id + `/exercise/getBySlug?slug=` + slug_input;
                    console.log(slug_url)
                    return get(slug_url)
                        .then(async (slug_respons) => {
                            console.log(slug_respons.data.content)
                            let index=0
                            while (index<slug_list.length) {
                                
                                var choose_ex = raw_input("Enter 'n' to go to next exercise or 'p' to go to previous exercise or \nTo exit from current cousre enter any key :-")
                                if (choose_ex == 'n' && index<slug_list.length-1) {
                                    let slug_next=slug_list[index+1]
                                    const slug_u = `http://saral.navgurukul.org/api/courses/` + course_id + `/exercise/getBySlug?slug=` + slug_next;
                                    const response = await axios.get(slug_u)
                                    console.log(response.data.content, '------await--------')
                                    index++
                                }else if (choose_ex=='p' && index>0) {
                                    let slug_priv=slug_list[index-1]
                                    const slug_u = `http://saral.navgurukul.org/api/courses/` + course_id + `/exercise/getBySlug?slug=` + slug_priv;
                                    const response = await axios.get(slug_u)
                                    console.log(response.data.content, '------await--------')
                                    index--
                                    
                                } else {
                                    console.log("\n\n---------------------You choose exit from current COURSE.------------------------------------\n\n")
                                    break;
        
                                } 
                                                                 
                            }
                        })

                })
        });

    })