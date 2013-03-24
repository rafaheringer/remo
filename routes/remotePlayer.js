/*
 * GET remote page.
 */

exports.index = function(req, res){
  res.render('remotePlayer', { title: 'Remote player' });
};