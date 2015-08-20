var apiRoot = "https://api.github.com/";

// validate the user input
function validateInput() {
    var isvalid = true;
    if (!validateUrl($("#github_url_1").val())) {
        //URL 1 is not valid, so let the user know
        $('#fielderror1').html('Please enter a GitHub URL in the following format: https://github.com/[USER]/[REPOSITORY]');
        isvalid = false;
    } else {
        $('#fielderror1').html('');
    }
    if (!validateUrl($("#github_url_2").val())) {
        //URL 2 is not valid, so let the user know
        $('#fielderror2').html('Please enter a GitHub URL in the following format: https://github.com/[USER]/[REPOSITORY]');
        isvalid = false;
    } else {
        $('#fielderror2').html('');
    }
    return isvalid;
}
function validateUrl(url) {
    url = url.toLowerCase();
    if (url.lastIndexOf('https://github.com/', 0) === 0 && url.split("/").length > 4 && url.split("/")[4].length > 0) {
        return true;
    } else {
        return false;
    }
}


// Build the html
function buildHtml(data) {

    var err = false;
    var errMessage = '';

    if (data.status == 404 || data.length == 0) {
        err = true;
        errMessage = "The project does not exist!";
    }

    var html = '';

    if (err) {
        html = "<div class='col-md-6 col-md-offset-3 error output'>" + errMessage + "</div>";
    } else {
        html += "<div class='col-md-6 col-md-offset-3 output'>";
        var latest = true;

        //show: "stargazers_count", "watchers_count", "forks_count"
        var stargazers_count = data.stargazers_count;
        var watchers_count = data.watchers_count;
        var forks_count = data.forks_count;
        var full_name = data.full_name;
        var html_url = data.html_url;

        html += "<div class='row release'>" +
            "<h4><a href='" + html_url + "' target='_blank'>" +
            "<span class='glyphicon glyphicon-tag'></span>&nbsp&nbsp" +
            full_name +
            "</a></h4><hr class='release-hr'>";

        html += "<h4><span class='glyphicon glyphicon-info-sign'></span>&nbsp&nbsp" +
            "Statistics:</h4>";

        html += "<ul>";

        html += "<li>Star count: " + stargazers_count + "</li>";
        html += "<li>Watcher count: " + watchers_count + "</li>";
        html += "<li>Fork count: " + forks_count + "</li>";

        html += "</ul>";
        html += "</div>";

        html += "</div>";
    }
    return html;
}

// Display the stats
function showStats1(data) {
    var html = buildHtml(data);

    var resultDiv = $("#stats-result #result1");
    resultDiv.hide();
    resultDiv.html(html);
    $("#loader-gif").hide();
    resultDiv.slideDown();
}

// Display the stats
function showStats2(data) {
    var html = buildHtml(data);

    var resultDiv = $("#stats-result #result2");
    resultDiv.hide();
    resultDiv.html(html);
    $("#loader-gif").hide();
    resultDiv.slideDown();
}

// Callback function for getting release stats
function getStats() {
    var user = $("#github_url_1").val().split("/")[3];
    var repository = $("#github_url_1").val().split("/")[4];
    console.log('user:' + user);
    console.log('repository:' + repository);

    var url = apiRoot + "repos/" + user + "/" + repository;
    $.getJSON(url, showStats1).fail(showStats1);

    var user2 = $("#github_url_2").val().split("/")[3];
    var repository2 = $("#github_url_2").val().split("/")[4];
    console.log('user2:' + user2);
    console.log('repository2:' + repository2);

    var url = apiRoot + "repos/" + user2 + "/" + repository2;
    $.getJSON(url, showStats2).fail(showStats2);
}

// The main function
$(function () {
    $("#loader-gif").hide();

    $("#compare-button").click(function () {
        if (validateInput()) {
            $(".output").hide();
            $("#description").hide();
            $("#loader-gif").show();
            getStats();
        }
        return false;
    });
});