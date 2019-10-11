var name2;
var fid2;

function output(){
    var x;
    x = document.getElementById('foodname').value;
    var raw = document.getElementById("raw").checked;
    var cooked = document.getElementById("cooked").checked;
    var column = document.getElementById('foods');
    var foodlist = [];

    if (raw){
        x = "raw " + x;
        name2 = x;
    }
    if (cooked){
        x = "cooked " + x;
        name2 = x;
    }




    $.getJSON("https://api.nal.usda.gov/ndb/search/?format=json&ds=Standard Reference&q="+x+"&max=1&offset=0&api_key=3nVWTFDGIlJY7PpGNFYwizG9Sk0npfDyQxFebsHc", function(data){

        //console.log(data);
        var items = data.list.item;
        items.forEach(function(f){
            var oneFood = {};
            oneFood["foodname"] = x;
            oneFood["foodId"] = f.ndbno;
            foodlist.push(oneFood);
        });
        //console.log(foodlist)



        let foodColumn = '';

        foodlist.forEach(function(name){
            console.log(name);
            var foodID = name.foodId;
            $.getJSON("https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=3nVWTFDGIlJY7PpGNFYwizG9Sk0npfDyQxFebsHc&nutrients=646&nutrients=309&nutrients=303&nutrients=203&nutrients=304&ndbno="+ foodID, function(unit){

                console.log(foodID);
                fid2 = foodID;
                var quantity = unit.report.foods[0].measure;
                var regex = /(\S+) (oz|OZA)/i;
                console.log(regex)
                console.log(unit)
                var found = quantity.match(regex);
                //console.log(found);
                if (found !== null){
                    quantity = "100.0 g";
                }
                var fid = "name-"+ foodID;
                var qid = "quantity-" + foodID;


                var fnamel = name.foodname.split(" ");
                var fn =  "";
                for(var i=1; i < fnamel.length; i++ ){
                    fn = fn + fnamel[i] + " ";
                }

                fname = fn;


                var regexFoodName = /(.+?)(, UPC.+)/i;
                var upc = fname.match(regexFoodName);
                //console.log(fname);
                //console.log(upc);
                if(upc !== null){
                    fname = upc[1];
                }
                console.log(fname);
                foodColumn += `<tr><td id = ${fid}>${fname}</td><td><input id=${qid} type="text" name="quantity" class="quantity form-control input-number" value="1" min="1" max="100"></td><td>${quantity}</td><td><a class="btn btn-primary py-3 px-4" id=${foodID} onclick="addFood()">Add</a></td></tr>`;

                //console.log(foodColumn);

                column.innerHTML = foodColumn;
            });


        })


    })
}

function addFood() {


    var id = fid2;
    console.log(id);
    var quantity = document.getElementById("quantity-"+ id).value;
    var table = document.getElementById("foods2");
    var rows = table.rows.length;
    //console.log(rows);

    $.getJSON("https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=3nVWTFDGIlJY7PpGNFYwizG9Sk0npfDyQxFebsHc&nutrients=646&nutrients=309&nutrients=303&nutrients=203&nutrients=304&ndbno="+ id, function(unit){

        //console.log(unit.report.foods[0]);
        var name = unit.report.foods[0].name;
        var regexFoodName = /(.+?)(, UPC.+)/i;
        var upc = name.match(regexFoodName);
        if(upc !== null){
            name = upc[1];
        }
        var serving = unit.report.foods[0].measure;
        var energy = unit.report.foods[0].nutrients[0].value,
            fiber = unit.report.foods[0].nutrients[1].value,
            sugar = unit.report.foods[0].nutrients[2].value,
            fat = unit.report.foods[0].nutrients[3].value,
            carb = unit.report.foods[0].nutrients[4].value;

        var regex = /(\S+) (oz|OZA)/i;
        var found = serving.match(regex);
        if (found !== null){
            serving = "100.0 g";

            energy = unit.report.foods[0].nutrients[0].gm;
            fiber = unit.report.foods[0].nutrients[1].gm;
            sugar = unit.report.foods[0].nutrients[2].gm;
            fat = unit.report.foods[0].nutrients[3].gm;
            carb = unit.report.foods[0].nutrients[4].gm;

            energy = energy.toString();
            fiber = fiber.toString();
            sugar = sugar.toString();
            fat = fat.toString();
            carb = carb.toString();

        }

        energy = energy.replace("--", "0.0");
        fiber = fiber.replace("--", "0.0");
        sugar = sugar.replace("--", "0.0");
        fat = fat.replace("--", "0.0");
        carb = carb.replace("--", "0.0");



        energy = (parseFloat(energy) * quantity).toFixed(2).toString();
        fiber = (parseFloat(fiber) * quantity).toFixed(2).toString();
        sugar = (parseFloat(sugar) * quantity).toFixed(2).toString();
        fat = (parseFloat(fat) * quantity).toFixed(2).toString();
        carb = (parseFloat(carb) * quantity).toFixed(2).toString();



        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0),
            cell2 = row.insertCell(1),
            cell3 = row.insertCell(2),
            cell4 = row.insertCell(3),
            cell5 = row.insertCell(4),
            cell6 = row.insertCell(5),
            cell7 = row.insertCell(6),
            cell8 = row.insertCell(7),
            cell9 = row.insertCell(8);

        cell1.innerHTML = name2;
        cell2.innerHTML = quantity;
        cell3.innerHTML = serving;
        cell4.innerHTML = energy;
        cell5.innerHTML = fiber;
        cell6.innerHTML = sugar;
        cell7.innerHTML = fat;
        cell8.innerHTML = carb;
        cell9.innerHTML = `<button class="btn btn-primary py-3 px-4" name="removebutton" type="button" onclick="remove(${rows})">Remove</button>`;

        var energySum = 0,
            fiberSum = 0,
            sugarSum = 0,
            fatSum = 0,
            carbSum = 0;
        //console.log("hello");

        for (var i = 0, row; row = table.rows[i]; i++){
            //console.log(i);
            energySum += parseFloat(table.rows[i].cells[3].innerHTML);
            //console.log(energySum);
            fiberSum += parseFloat(table.rows[i].cells[4].innerHTML);
            sugarSum += parseFloat(table.rows[i].cells[5].innerHTML);
            fatSum += parseFloat(table.rows[i].cells[6].innerHTML);
            carbSum += parseFloat(table.rows[i].cells[7].innerHTML);
        }

        energySum = energySum.toFixed(2);
        fiberSum = fiberSum.toFixed(2);
        sugarSum = sugarSum.toFixed(2);
        fatSum = fatSum.toFixed(2);
        carbSum = carbSum.toFixed(2);

        // var total = document.getElementById("subtotal");
        // var addtotal = `<tr><td>${energySum}</td><td>${fiberSum}</td><td>${sugarSum}</td><td>${fatSum}</td><td>${carbSum}</td></tr>`
        // total.innerHTML = addtotal;
        var eng = document.getElementById("ome"),
            fib = document.getElementById("zinc"),
            sug = document.getElementById("pre"),
            fat = document.getElementById("iron"),
            carb = document.getElementById("mg");

        eng.innerHTML = energySum;
        fib.innerHTML = fiberSum;
        sug.innerHTML = sugarSum;
        fat.innerHTML = fatSum;
        carb.innerHTML = carbSum;

        // var subtotal = table.insertRow(-1);
        // var cell1 = row.insertCell(0),
        //     cell2 = row.insertCell(1),
        //     cell3 = row.insertCell(2),
        //     cell4 = row.insertCell(3),
        //     cell5 = row.insertCell(4),
        //     cell6 = row.insertCell(5),
        //     cell7 = row.insertCell(6),
        //     cell8 = row.insertCell(7),
        //     cell9 = row.insertCell(8);
        console.log(eng);
        pie();
    });



}

function remove(index) {

    var table = document.getElementById("foods2");
    table.deleteRow(index);
    //console.log(table);


    for (var i = 0, row; row = table.rows[i]; i++) {
        //console.log(row.rowIndex);
        //console.log(i);
        //var fun = "remove(" + i + ")";
        //row.cells[8].firstChild.onclick = remove(i);
        // var clickfun = row.cells[8].firstChild.getAttribute("onclick");
        // var funname = clickfun.substring(0,clickfun.indexOf("("));
        // document.getElementById("button1").setAttribute("onclick",funname+"("+i+")");
        var child = row.cells[8].firstChild;
        var td = row.cells[8];
        td.removeChild(child);

        row.cells[8].innerHTML = `<button class="btn btn-primary py-3 px-4" name="removebutton" type="button" onclick="remove(${i})">Remove</button>`;

    }

    var energySum = 0,
        fiberSum = 0,
        sugarSum = 0,
        fatSum = 0,
        carbSum = 0;

    for (var i = 0, row; row = table.rows[i]; i++){
        //console.log(i);
        energySum += parseFloat(table.rows[i].cells[3].innerHTML);
        //console.log(energySum);
        fiberSum += parseFloat(table.rows[i].cells[4].innerHTML);
        sugarSum += parseFloat(table.rows[i].cells[5].innerHTML);
        fatSum += parseFloat(table.rows[i].cells[6].innerHTML);
        carbSum += parseFloat(table.rows[i].cells[7].innerHTML);
    }

    energySum = energySum.toFixed(2);
    fiberSum = fiberSum.toFixed(2);
    sugarSum = sugarSum.toFixed(2);
    fatSum = fatSum.toFixed(2);
    carbSum = carbSum.toFixed(2);

    // var total = document.getElementById("subtotal");
    // var addtotal = `<tr><td>${energySum}</td><td>${fiberSum}</td><td>${sugarSum}</td><td>${fatSum}</td><td>${carbSum}</td></tr>`
    // total.innerHTML = addtotal;

    var eng = document.getElementById("ome"),
        fib = document.getElementById("zinc"),
        sug = document.getElementById("pre"),
        fat = document.getElementById("iron"),
        carb = document.getElementById("mg");

    eng.innerHTML = energySum;
    fib.innerHTML = fiberSum;
    sug.innerHTML = sugarSum;
    fat.innerHTML = fatSum;
    carb.innerHTML = carbSum;

    pie();

}


function addCustomerFoodButton() {
    let display = document.getElementsByClassName("customize-food");
    // var style = window.getComputedStyle(display,null);
    //  var   dis = style.getPropertyValue('display');
    console.log(display);
    for (var i = 0; i != display.length; i++) {
        if (display[i].style.display == "none")
            display[i].style.display = "block";
        else
            display[i].style.display = "none";
    }
}

function addCustomerFood() {
    var eng = document.getElementById("addeng").value,
        fib = document.getElementById("addfib").value,
        sug = document.getElementById("addsug").value,
        fat = document.getElementById("addfat").value,
        carb = document.getElementById("addcarb").value,
        name = document.getElementById("addname").value,
        quan = document.getElementById("addquantity").value;


    var table = document.getElementById("foods2");
    var rows = table.rows.length;

    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0),
        cell2 = row.insertCell(1),
        cell3 = row.insertCell(2),
        cell4 = row.insertCell(3),
        cell5 = row.insertCell(4),
        cell6 = row.insertCell(5),
        cell7 = row.insertCell(6),
        cell8 = row.insertCell(7),
        cell9 = row.insertCell(8);

    cell1.innerHTML = name;
    cell2.innerHTML = quan;
    cell3.innerHTML = "1 gram";
    cell4.innerHTML = eng;
    cell5.innerHTML = fib;
    cell6.innerHTML = sug;
    cell7.innerHTML = fat;
    cell8.innerHTML = carb;
    cell9.innerHTML = `<button name="removebutton" type="button" onclick="remove(${rows})">Remove</button>`;

    var energySum = 0,
        fiberSum = 0,
        sugarSum = 0,
        fatSum = 0,
        carbSum = 0;

    for (var i = 0, row; row = table.rows[i]; i++){
        //console.log(i);
        energySum += parseFloat(table.rows[i].cells[3].innerHTML);
        //console.log(energySum);
        fiberSum += parseFloat(table.rows[i].cells[4].innerHTML);
        sugarSum += parseFloat(table.rows[i].cells[5].innerHTML);
        fatSum += parseFloat(table.rows[i].cells[6].innerHTML);
        carbSum += parseFloat(table.rows[i].cells[7].innerHTML);
    }

    energySum = energySum.toFixed(2);
    fiberSum = fiberSum.toFixed(2);
    sugarSum = sugarSum.toFixed(2);
    fatSum = fatSum.toFixed(2);
    carbSum = carbSum.toFixed(2);

    // var total = document.getElementById("subtotal");
    // var addtotal = `<tr><td>${energySum}</td><td>${fiberSum}</td><td>${sugarSum}</td><td>${fatSum}</td><td>${carbSum}</td></tr>`
    // total.innerHTML = addtotal;

    var eng1 = document.getElementById("ome"),
        fib1 = document.getElementById("zinc"),
        sug1 = document.getElementById("pre"),
        fat1 = document.getElementById("iron"),
        carb1 = document.getElementById("mg");

    eng1.innerHTML = energySum;
    fib1.innerHTML = fiberSum;
    sug1.innerHTML = sugarSum;
    fat1.innerHTML = fatSum;
    carb1.innerHTML = carbSum;

    pie();
}


function pie() {

    var ome = parseInt(document.getElementById("ome").innerHTML),
        zinc = parseInt(document.getElementById("zinc").innerHTML),
        pre = parseInt(document.getElementById("pre").innerHTML),
        iron = parseInt(document.getElementById("iron").innerHTML),
        mg = parseInt(document.getElementById("mg").innerHTML);
    var smile = document.getElementById("smile")
    var count = 0;
    if(ome - 1.6 <= 0){
        count += 1
    }
    if(zinc - 8 <= 0){
        count += 1
    }
    if(pre - 50 <= 0){
        count += 1
    }
    if(iron - 18 <= 0){
        count += 1
    }
    if(mg - 410 <= 0){
        count += 1
    }

    if (count == 0){
        var pic = `<div style="float: left;"><p style="font-size: 20px; color: black;">Your daily intake is: </p></div><div  style="width: 300px; height: 300px; float: left"><img src="images/good.png" class="gal__img" alt="Image 5"></div>`
        smile.innerHTML = pic;
    }
    if (count >0 && count <=2){
        var pic = `<div style="float: left;"><p style="font-size: 20px; color: black;">Your daily intake is: </p></div><div  style="width: 300px; height: 300px; float: left"><img src="images/soso.png" class="gal__img" alt="Image 5"></div>`
        smile.innerHTML = pic;
    }
    if (count > 2){
        var pic = `<div style="float: left;"><p style="font-size: 20px; color: black;">Your daily intake is: </p></div><div  style="width: 300px; height: 300px; float: left"><img src="images/sad.png" class="gal__img" alt="Image 5"></div>`
        smile.innerHTML = pic;
    }
    //
    // pro = (pro/sum * 100).toFixed(2);
    // fat = (fat/sum *100).toFixed(2);
    // carb = (100 - pro - fat);
    // console.log(pro,fat,carb);
    //
    // let display = document.getElementById("piechart");
    // //console.log(display);
    //  // var style = window.getComputedStyle(display,null);
    //  // var   dis = style.getPropertyValue('display');
    // //console.log(display.style);
    //
    //     //console.log(sum);
    //     if (sum !== 0) {
    //         console.log(display.style.display);
    //         display.style.display = "block";
    //     }
    //     else{
    //         display.style.display = "none";
    //     }
    //
    //
    //
    //
    // var chart = new CanvasJS.Chart("chartContainer", {
    //     animationEnabled: true,
    //     title: {
    //         text: "Your nutrients ratio"
    //     },
    //     data: [{
    //         type: "pie",
    //         startAngle: 240,
    //         yValueFormatString: "##0.00\"%\"",
    //         indexLabel: "{label} {y}",
    //         dataPoints: [
    //             {y: pro, label: "Protein"},
    //             {y: fat, label: "Fat"},
    //             {y: carb, label: "Carbohydrate"}
    //         ]
    //     }]
    // });
    // chart.render();


}



