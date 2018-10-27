#include<stdio.h>
#include<stdlib.h>
#include<math.h>
#include<string.h>
#define MAX_NAME_LEN 10
#define MAX_ITEM_VAR 25

/*
	0 Straight path 35%
	1 Left only 25%
	2 Right only 25%
	3 Both paths available 10%
	4 Dead end 5%
*/

void printmenus(int selection);

struct item{
	char name[MAX_NAME_LEN];
	int amnt;
};
typedef struct item item_t;

struct player{
	int health;
	int magic;
	int gold;
	struct item* pouch[MAX_ITEM_VAR];
};
typedef struct player player_t;

int main(void){
	int roomsVisited = 0;
	int leftOrRight;
	
	printmenus(1);
	return 0;
}

void printmenus(int selection){
	switch(selection){
		case 1:
			printf("Welcome to the world of RP-Bot! <BETA-ACTIVATED>\n");
			printf("Where do you wish to go?\n");
			printf("1. To the dungeon!\n");
			printf("2. To the shop!\n");
			printf("3. I'm outta here.\n");
			break;
		default:
			printf("You've used a wrong menu number, developer. Please report to the nearest available [REDACTED]\n");
			break;
	}
}