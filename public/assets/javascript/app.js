//Jquery
$( document ).ready(function() {
	//hide the container
	$('.container').hide()
		//run the fetch data function to scrape the data
		fetchData();

		//hide section before anything
		$('#seek-box').hide();
		$('#input-area').hide();
		$('#saved-text').hide();
		$('#saved-area').hide();

		//when the visitor clicks on the #seek-box
		$('#seek-box').click(function(){
			//grab whatever article data has been scraped into the db
			//and populate the proper section
			populate();

			//with the done reveal the container
			$('.container').show();

			//hide the initial  seek box from view
			$('#seek-box').hide();
		});	
    console.log( "ready!" );
});

	//set up these global variables

	var mongoData;
	var dataCount = 0;
	var dataDate;

	// these variables let the fancy cube on our the page function properly
	
	var state = 0;
	var cubeRotateAry = ['show-front', 'show-back', 'show-right', 'show-left', 'show-top', 'show-bottom'];
	var sideArray = ['back','right', 'left', 'top','bottom','front'];

	//ajax get call for JSON to grab all articles scraped to our db

	var papulate = function(){

  	// jQuery AJAX call for JSON to grab all articles scraped to our db
  	$.getJASON('check', function(data){

  		//save the latest article's date to our mongoData variable

  		mongoData = data;

  		// save the latest article's date and save it to dataDate

  		dataDate = mongoData[mongoData.length -1].date;

  	})

  	//when that's done
  	.done(function(){
  		//running click and saveNote function
  		clickBox();
  		saveNote();
  		});
	};

	//ajax get notes data
	var gather = function(){
		//find the article's current id
		var idCount = dataCount -1;

		//jQuery AJAX call for JSON data of Notes

		$.ajax({
			type: 'POST',
			dataType: 'JSON',
			url: '/gather',
			data: {
				id:mongoData[idCount]._id
			}
		})

		//with that done, post the current Notes to the page
		.done(function(currentNotes){
			postNote(currentNotes);
		})
		//if something went wrong,...
		.fail(function(){
			console.log('Sorry. Server Unavailable')
		});
	};

		//render notes data in the last function
		var postNote = function(currentNotes) {

			//remove inputs form the note box
			$('#note-box').val('');

			//make an empty placeholder var for note

			var note = '';

			//for each of the notes
			for (var i = 0; currentNotes.length; i++) {
				//make the note variable equal to itself,
				//plus the new note and a new line
				note = note + currentNotes[i].note +'\n';
			}
			//put the current collection of the note into the notebox
			$('#note-box').val(note);
		};

		//function containing listener to save notes and clear note taking area

		var saveNote = function(){
			//when someone clicks the note button
			$('#note-button').on('click', function(){

				//grab the value from the input box
				var text = $('#input-box').val();

				//grab the current article's id
				var idCount = dataCount -1;

				//aja call to save the note
				$.ajax({
					type:'POST',
					dataType: 'json',
					url: '/save',
					data: {
						id: mongoData[idCount]._id, // article id
						date: dateDate, // date of article's last update
						note: text //date of note
					}

				})
				//with that done
				.done(function(){

					//empty the input box
					$('input-box').val('');

					//grab the notes again because we just save a new note
				gather();
				})
				//if it fails, give the user an error massage
				.fail(function(){
					console.log('Sorry, Server unavaialble');
				});
			});
		};

		//function containing listener to delete notes and clear note taking area
		var deleteNote = function(){
			//when user clicks delete button
			$('#delete-button').on('click', function(){

				//make the idCount equal the current article
				var idCount = dataCount -1;

				//send an ajax call to delete

				$.ajax({
					type: 'DELETE',
					dataType: 'JSON',
					url: '/delete',
					data: {
						id: mongoData[idCount]._id,
					}
				})

				///with that done, empty the note-box input
				.done(function(){
					$('#note-box').val('');
				})
				//if it fails, tell the user
				.fail(function(){
					console.log('Sorry. Server unavaialble.');
				});

			});
		};

		//This function  handles typing animations
		var typeIt = function(){
			$('#typewrite-headline').remove();
			$('#typewrite-summary').remove();

			var h = 0;
			var s = 0;
			var newsText;

			if (state > 0){
				side  = state -1;
			} else {
				side = 5;
			}
		

		$('.' + sideAry[side]).append("<div id='typewrite-headline'></div>");
		$('.' + sideAry[side]).append("<div id='typewrite-summary'></div>");

		//cycle to different story
		console.log(mongoData);
		var headline = mongoData[dataCount].title;
		var summary = mongoData[dataCount].summary;

		dataCount++;
		//type animation for new summary
		(function type(){
			printHeadline = headline.slice(0, ++h);
			printSummary = summary.slice(0, ++s);

			//put in the text via javascript 
			$('#typewriter-headline').text(printHeadline);
			$('#typewriter-summary').text(printSummary);

			//return stop when text is equal to the writeTxt
			if(printHeadline.length === headline.length && printSummary.length ===summary.length){
				return;
			}
			setTimeout(type, 35);
		
	}());
};

		//render the headline 
		var  headline = function (){
			//create the text related to the number of the current article
			var show = "|| Article:" + (dataCount + 1)  + " ||";
			//place it in the text box
			$('#headline').text(show);
			//fade the headline in
			$('#headline')fadeIn()
			//adding the style properties to it
			.css({
				position: 'relative',
				'text-align': 'center',
				top: 100
			})
			.animate({
				position: 'relative',
				top: 0
			});
		};

		//This function handles what happens when the cube is clicked

		var clickBox = function(){
			$('#cube').on('click',function(){
				//rotate cycle

				if(state  <= 5){
				 state++;
				}else {
				 state = 0;
				}

				//add the proper status to the cube based on where it's clicked
				$('#cube').removeClass().addClass(cubeRotateAry[state]);

				//animate headline
				headline();

				//animate text
				typeIt();

				//render notes
				gather();

				//enable delete click listener
				deleteNote();

				//show the note boxes
				$('#input-area').show();
				$('#saved-area').show();
			});
		};

		//ajax call to do the scrape
		var fetchData = function(){
			//call Fetch with AJAX
			$.ajax({
				type:'POST',
				url:'fetch'
			}).done (function(){
				//show the seek box if it worked 
				$('#seek-box').show();
			}).fail(function(){
				//otherwise tell the user an issue has occurred
				alert('sorry. Server Unavailable.'); 
			});
		};
