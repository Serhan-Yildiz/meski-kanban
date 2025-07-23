import 'package:flutter/material.dart';

class CardBox extends StatelessWidget {
  final String title;

  const CardBox({required this.title});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: EdgeInsets.only(bottom: 8),
      padding: EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Color(0xFFcce4f6)),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(title),
    );
  }
}
