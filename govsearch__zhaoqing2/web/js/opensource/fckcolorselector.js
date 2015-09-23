/*
 * FCKeditor - The text editor for internet
 * Copyright (C) 2003-2006 Frederico Caldeira Knabben
 * 
 * Licensed under the terms of the GNU Lesser General Public License:
 * 		http://www.opensource.org/licenses/lgpl-license.php
 * 
 * For further information visit:
 * 		http://www.fckeditor.net/
 * 
 * "Support Open Source software. What about a donation today?"
 * 
 * File Name: fcktextcolorcommand.js
 * 	FCKTextColorCommand Class: represents the text color comand. It shows the
 * 	color selection panel.
 * 
 * File Authors:
 * 		Frederico Caldeira Knabben (fredck@fckeditor.net)
 */

// FCKTextColorCommand Contructor
//		type: can be 'ForeColor' or 'BackColor'.
var FCKTextColorCommand = function( type,CallBack,skincss)
{
	this.Name = type == 'ForeColor' ? 'TextColor' : 'BGColor' ;
	this.Type = type ;
	this.CallBack = CallBack;

	var oWindow ;
	
	oWindow = window ;

	this._Panel = new FCKPanel( oWindow, true ) ;
	this._Panel.AppendStyleSheet( skincss) ;
	this._Panel.MainNode.className = 'FCK_Panel' ;
	this._CreatePanelBody( this._Panel.Document, this._Panel.MainNode ) ;
	
	FCKTools.DisableSelection( this._Panel.Document.body ) ;
}

FCKTextColorCommand.prototype.Execute = function( panelX, panelY, relElement ){
	// Show the Color Panel at the desired position.
	this._Panel.Show( panelX, panelY, relElement ) ;
}

FCKTextColorCommand.prototype.SetColor = function( color ){
	this.CallBack(color);
}

function FCKTextColorCommand_OnMouseOver()	{ this.className='ColorSelected' ; }

function FCKTextColorCommand_OnMouseOut()	{ this.className='ColorDeselected' ; }

function FCKTextColorCommand_OnClick()
{
	this.className = 'ColorDeselected' ;
	this.Command.SetColor( '#' + this.Color ) ;
	this.Command._Panel.Hide() ;
}

function FCKTextColorCommand_AutoOnClick()
{
	this.className = 'ColorDeselected' ;
	this.Command.SetColor( '' ) ;
	this.Command._Panel.Hide() ;
}

function FCKTextColorCommand_Cleanup()
{
	if(this._Items){
		for ( var i=0,n=this._Items.length;i<n;i++ ){
			var oItem = this._Items[i];
			if(oItem){
				oItem.Command = null ;
				oItem.onmouseover = oItem.onmouseout = oItem.onclick = null;
			}
		}
		this._Items = null;
	}
	FCKPanel_Cleanup.call(this._Panel);
	this._Panel = null;
	this.CallBack = null;
}

FCKTextColorCommand.prototype._CreatePanelBody = function( targetDocument, targetDiv )
{
	function CreateSelectionDiv()
	{
		var oDiv = targetDocument.createElement( "DIV" ) ;
		oDiv.className		= 'ColorDeselected' ;
		oDiv.onmouseover	= FCKTextColorCommand_OnMouseOver ;
		oDiv.onmouseout		= FCKTextColorCommand_OnMouseOut ;

		return oDiv ;
	}

	// Create the Table that will hold all colors.
	var oTable = targetDiv.appendChild( targetDocument.createElement( "TABLE" ) ) ;
	oTable.className = 'ForceBaseFont' ;		// Firefox 1.5 Bug.
	oTable.style.tableLayout = 'fixed' ;
	oTable.cellPadding = 0 ;
	oTable.cellSpacing = 0 ;
	oTable.border = 0 ;
	oTable.width = 150 ;

	var oCell = oTable.insertRow(-1).insertCell(-1) ;
	oCell.colSpan = 8 ;
	this._Items = [];
	// Create the Button for the "Automatic" color selection.
	var oDiv = oCell.appendChild( CreateSelectionDiv() ) ;
	oDiv.innerHTML =
		'<table cellspacing="0" cellpadding="0" width="100%" border="0">\
			<tr>\
				<td><div class="ColorBoxBorder"><div class="ColorBox" style="background-color: #000000"></div></div></td>\
				<td nowrap width="100%" align="center">自动</td>\
			</tr>\
		</table>' ;

	oDiv.Command = this ;
	oDiv.onclick = FCKTextColorCommand_AutoOnClick ;
	this._Items.push(oDiv);
	// Create an array of colors based on the configuration file.
	var arrFontColors = '000000,993300,333300,003300,003366,000080,333399,333333,800000,FF6600,808000,808080,008080,0000FF,666699,808080,FF0000,FF9900,99CC00,339966,33CCCC,3366FF,800080,999999,FF00FF,FFCC00,FFFF00,00FF00,00FFFF,00CCFF,993366,C0C0C0,FF99CC,FFCC99,FFFF99,CCFFCC,CCFFFF,99CCFF,CC99FF,FFFFFF' ;
	var aColors = arrFontColors.toString().split(',') ;

	// Create the colors table based on the array.
	var iCounter = 0 ;
	while ( iCounter < aColors.length )
	{
		var oRow = oTable.insertRow(-1) ;

		for ( var i = 0 ; i < 8 && iCounter < aColors.length ; i++, iCounter++ )
		{
			oDiv = oRow.insertCell(-1).appendChild( CreateSelectionDiv() ) ;
			oDiv.Color = aColors[iCounter] ;
			oDiv.innerHTML = '<div class="ColorBoxBorder"><div class="ColorBox" style="background-color: #' + aColors[iCounter] + '"></div></div>' ;

			oDiv.Command = this ;
			oDiv.onclick = FCKTextColorCommand_OnClick ;
			this._Items.push(oDiv);
		}
	}
}
