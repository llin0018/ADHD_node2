function physicalReport(){
    var vigDay = parseInt(document.getElementById("vigDay").value),
        vigHour = parseInt(document.getElementById("vigHour").value),
        vigMinute = parseInt(document.getElementById("vigMinute").value),
        modDay = parseInt(document.getElementById("modDay").value),
        modHour = parseInt(document.getElementById("modHour").value),
        modMinute = parseInt(document.getElementById("modMinute").value),
        walkDay = parseInt(document.getElementById("walkDay").value),
        walkHour = parseInt(document.getElementById("walkHour").value),
        walkMinute = parseInt(document.getElementById("walkMinute").value),


        actLevel = 1,
        comment = "",
        //met = (walkHour * 6+ walkMinute)*3.3;
        met = (vigDay * (vigHour * 60 + vigMinute) * 8) + (modDay * (modHour * 60 + modMinute) * 4) + (walkDay * (walkHour * 60 + walkMinute) * 3.3);

    if (vigDay >= 3 && (vigHour*60+vigMinute >= 20)){
        actLevel = 2
    }
    if ((modDay+walkDay >= 5) && (modHour*60+walkHour*60+modMinute+walkMinute >= 30)){
        actLevel = 2
    }
    if ((modDay+walkDay+vigDay >= 5) && (met >= 600)){
        actLevel = 2
    }
    if  (vigDay >= 3 && met >= 1500){
        actLevel = 3
    }
    if ((modDay+walkDay+vigDay >= 7) & (met >= 3000)){
        actLevel = 3
    }
    if (actLevel == 1) {
        alert("Your activity level is Low, both quantity and quality of your daily physical exercise need improvement. " +
            "Due to your low activity level, you should start exercise with moderate activities like jogging, low-pace bicycling, etc.")
    }//Report comment
    if (actLevel == 2) {
        alert("Your activity level is Moderate, you have a normal amount of daily physical activity. " +
            "It will be good for your body if you keep your daily physical activities up. Besides, you can also try to do some vigorous " +
            "activities such as aerobic exercise.")
    }
    if (actLevel == 3) {
        alert("Your activity level is High, your daily physical activity is qualitatively and quantitatively appropriate. You can choose " +
            "some high-intense activity like martial arts.")
    }
    var report = document.getElementById("report");
        // row = report.insertRow(-1),
        // cell1 = row.insertCell(0);

    report.innerHTML = comment;
}