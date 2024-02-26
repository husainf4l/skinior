import 'package:flutter/material.dart';

class NavBar extends StatelessWidget {
  // Assuming these parameters are passed to the Navbar widget
  // based on the user's authentication status and information
  const NavBar({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      elevation: 0,
      title: const Row(
        children: [
          Text('Skinior', style: TextStyle(color: Colors.black)),
        ],
      ),
    );
  }
}
