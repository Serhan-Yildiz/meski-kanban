import 'package:flutter/material.dart';
import 'package:meski_kanban_mobile/widgets/card_box.dart';
import 'package:meski_kanban_mobile/widgets/custom_input.dart';

class ListColumn extends StatefulWidget {
  final String listTitle;
  final List<Map<String, dynamic>> cards;
  final Function(String) onAddCard;

  const ListColumn({
    required this.listTitle,
    required this.cards,
    required this.onAddCard,
  });

  @override
  State<ListColumn> createState() => _ListColumnState();
}

class _ListColumnState extends State<ListColumn> {
  final cardInputController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 260,
      decoration: BoxDecoration(
        color: Color(0xFFf1f8fc),
        borderRadius: BorderRadius.circular(12),
      ),
      padding: EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.listTitle,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: Color(0xFF006eae),
              fontSize: 16,
            ),
          ),
          SizedBox(height: 12),
          ...widget.cards.map((c) => CardBox(title: c["title"])).toList(),
          SizedBox(height: 12),
          CustomInput(
            controller: cardInputController,
            hintText: "Yeni kart",
            onSubmitted: (val) {
              if (val.trim().isNotEmpty) {
                widget.onAddCard(val);
                cardInputController.clear();
              }
            },
          ),
        ],
      ),
    );
  }
}
