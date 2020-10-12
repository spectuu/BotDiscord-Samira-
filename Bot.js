const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./prefix.json")
const command = require("./Command")
const PrivateMessage = require("./Private-message")
const mysql = require("mysql");
const {Client , MessageEmbed} = require('discord.js');

let con = mysql.createConnection({

  host: "localhost",
  user: "root",
  password: "",
  database: ""
  });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setStatus('idle')
  console.log(client.user.presence.status)
});

client.on("guildCreate", guild =>{
  con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql1 = "INSERT INTO mensaje_de_bienvenida(server, mensaje, canal, description) VALUES ('" + guild.id + "','Bienvenido al server! $usuario$ ', ' None ', ' None ')";
  con.query(sql1,function (err, result) {
  if (err) throw err;
  console.log("1 record inserted");
    });
  });
});


command(client, ['AddServerDescription', 'UPDescription'], (message) => {
const { member, mentions } = message
const tag = `<@${member.id}>`
if(member.hasPermission('ADMINISTRATOR')){
var remover = "sp!AddServerDescription";
var remover2 = "sp!UPDescription";
var descripcion = message.content.substring(remover.length);
descripcion = message.content.substring(remover2.length);
var sql3 = "UPDATE mensaje_de_bienvenida SET description='"+ descripcion +"' WHERE server= '" + guild.id + "'";
con.query(sql3,function (err, result) {
if (err) throw err;
message.channel.send(
"Se a cambiado la descripcion del server :D").then(msg => msg.delete(
{timeout: 5000}))
console.log(result);
    });
  }else{
    message.channel.send(`${tag} No tienes permiso para usar este comando`).then(msg => msg.delete({timeout: 5000}))
  }
})

command(client, 'ServerInfo', (message) => {
const { guild } = message
const {name, region, memberCount, owner, id } = guild
const icon = guild.iconURL()
var sql5 = "SELECT mensaje,server,canal,description FROM mensaje_de_bienvenida WHERE server= " + guild.id +'';
console.log("El mensaje a sido seleccionado");
con.query(sql5,function (err, result) {
if (err) throw err;
console.log(result);
var ServerDescription = result[0].description;
console.log(guild)
const embed = new Discord.MessageEmbed()
.setTitle(`Info del Server:  "${name}"`)
.setThumbnail(icon)
.addFields({
  name: 'Region',
  value: region,
},
{
  name: 'Miembros',
  value: memberCount,
},
{
  name: 'Dueño',
  value: owner.user.tag
},
{
  name: 'ID',
  value: id,
},
{
  name: 'Descripcion',
  value: ServerDescription,
}
)
message.channel.send(embed)
  }); 
})

command(client, 'UserInfo', (message) => {
 const user = message.mentions.users.first()
 const { users } = message
 const {id, username, discriminator, avatar, bot} = user
 const icon = user.avatarURL()

 const embed = new MessageEmbed()
 .setTitle(`Info del Usuario:  "${username}"`)
 .setThumbnail(icon)
 .addFields(
   {
    name: 'Nombre',
    value: username,
   },
   {
    name: 'Etiqueta',
    value: discriminator,
   },
   {
    name: '¿Es un bot?',
    value: bot,
   },
   {
    name: 'ID',
    value: id,
   },
 )
message.channel.send(embed)
})

command(client, ['CC', 'ClearChannel'], (message) =>{
  const { member, mentions } = message
  const tag = `<@${member.id}>`
  if(message.member.hasPermission(`ADMINISTRATOR`)){
  message.channel.messages.fetch().then((results) => {
  message.channel.bulkDelete(results)
      })
  }else{
    message.channel.send(`${tag} no tienes permiso para usar este comando`)
  }
})

command(client, 'ban', (message) => {
  const { member, mentions } = message
  const tag = `<@${member.id}>`
  if(member.hasPermission('ADMINISTRATOR') || (member.hasPermission('BAN_MEMBERS'))){
    const user = message.mentions.users.first()
    if(user){
      const UserMember = message.guild.members.cache.get(user.id)
      UserMember.ban()
      message.channel.send(`El usuario ha sido baneado`)
    }else{
      message.channel.send(`${tag} por favor mencione al usuario que desea banear`)
    }
  }else{
    message.channel.send(`${tag} No tienes permiso para usar este comando`)
  }

})

command(client, 'kick', (message) => {
  const { member, mentions } = message
  const tag = `<@${member.id}>`
  if(member.hasPermission('ADMINISTRATOR') || member.hasPermission('KICK_MEMBERS')){
    const user = message.mentions.users.first()
    if(user){
      const UserMember = message.guild.members.cache.get(user.id)
      UserMember.kick()
      message.channel.send(`El usuario ha sido kickeado`)
    }else{
      message.channel.send(`${tag} por favor mencione al usuario que desea kickear`)
    }
  }else{
    message.channel.send(`${tag} No tiene permiso para usar este comando`)
  }

})

command(client, ['SetInfo'], (message) => {
  const Replace = message.content.replace('sp!SetStatus', ' ')
    client.user.setPresence({
    activity:{
    name: Replace,
    type: 0,
    }
  })
})

command(client, 'BotStatus', (message) => {
  const Status = client.user.presence.status
  message.channel.send(`El estado actual del bot es ${Status}`)
})

command(client, 'SetStatus', (message) => {
  
})

command(client, ['Feliz Cumple', 'FC'], (message) => {
  var usuario = message.mentions.users.first()
  const embed = new MessageEmbed()
  .setTitle(`${message.author.username} Te desea un feliz cumple ` + usuario.username)
  .setColor([3, 252, 198])
  .setImage(
  "https://4.bp.blogspot.com/-68dIWg_PU7c/XccAlb91_AI/AAAAAAAClF0/PPWgOv8JUPcQo-n4O-mFkTgc_rRmWS8AgCK4BGAYYCw/s320/FELIZ-CUMP10.gif"
  )
   message.channel.send(embed);
})

command(client, ['Update the id of the welcome message', 'UIMessage'], (message) =>{
  var canal = message.mentions.channels.first();
  var sql2 = "UPDATE mensaje_de_bienvenida SET canal= '"+ canal.id +"' WHERE Server= '" + message.guild.id + "'";
  con.query(sql2,function (err, result) {
  if (err) throw err;
  message.channel.send(
    `Ahora el mensaje de bienvenida se enviara al canal ${canal} n.n`).then(msg => msg.delete(
  {timeout: 5000 }))
  console.log(result);
  })
})

command(client, ['UpdateMessage', 'UPMessage'], (message) => {
  var remover = "sp!UpdateMessage";
  var remover2 = "sp!UPMessage";
  var nuevoMensaje = message.content.substring(remover.length);
  nuevoMensaje = message.content.substring(remover2.length);
  var sql3 = "UPDATE mensaje_de_bienvenida SET mensaje='"+ nuevoMensaje +"' WHERE server= '" + message.guild.id + "'";
  con.query(sql3,function (err, result) {
  if (err) throw err;
  message.channel.send(
  "Se a cambiado el mensaje de bienvenida :D").then(msg => msg.delete(
  {timeout: 5000}))
  console.log("todo esta bien!");
   });
  })

  client.on("guildMemberAdd", miembro =>{
    console.log("ok");
    var sql6 = "SELECT mensaje,server,canal,description FROM mensaje_de_bienvenida WHERE server= " + miembro.guild.id +'';
    console.log("El mensaje a sido seleccionado");
    con.query(sql6,function (err, result) {
    if (err) throw err;
    console.log(result);
    var mensajeServidor = result[0].mensaje;
    var remplazar = "$usuario$"
    var usuario = "<@"+miembro.id+">"
    var enviar = result[0].canal;
    var Canal = client.channels.cache.find(channel => channel.id === (enviar));
    mensajeServidor = mensajeServidor.replace(remplazar, usuario);
    Canal.send(mensajeServidor);
      });
    });

client.login('NzU2NTgxNjM5ODczNjI2MjEz.X2T7jw.94cClsV9_JV2IkUNRsKsaXapkUQ');
