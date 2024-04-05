# from __future__ import annotations
# # import fastapi
# # from fastapi.responses import FileResponse
# from typing import Optional
# # from re import sub


# # def format_code(data: str):
# #     return sub(
# #         r"(\s{4}|\t)", r"\\t",
# #         sub(r"\n", r"\", \"", data.replace("\"", "\\\"")))


# # code = """
# # match ${1:variable}:
# #     case "${2:vlaue}":
# #         break
# #     case "_":
# #         break"""


# # print(format_code(code))


# class Tree:
#     value: int

#     left: Optional[Tree] = None
#     right: Optional[Tree] = None

#     def __init__(self,
#                  value: int,
#                  left: Optional[Tree] = None,
#                  right: Optional[Tree] = None) -> None:

#         self.value = value
#         self.left = left
#         self.right = right

#     def find_node(self, value: int) -> Optional[Tree]:
#         if value < self.value and not self.left is None:
#             self.left.find_node(value)

#         elif value > self.value and not self.right is None:
#             self.right.find_node(value)

#         elif self.value == value:
#             return self

#         else:
#             return None


# class Vector:
#     x: int
#     y: int

#     def __init__(self, x: int, y: int) -> None:
#         self.x = x
#         self.y = y

#     def type_checker(function):
#         def wrapper(self, other):
#             if not isinstance(other, Vector):
#                 raise TypeError(
#                     f"uncorrect type: extended type - Vector, your - {type(other)}")
            
#             return function(self, other)

#         return wrapper

#     @type_checker
#     def __add__(self, other: Vector):
#         return Vector(other.x + self.x, other.y + self.y)

#     @type_checker
#     def __radd__(self, other: Vector):
#         return Vector(other.x + self.x, other.y + self.y)

#     @type_checker
#     def __sub__(self, other: Vector):
#         return Vector(self.x - other.x, self.y - other.y)

#     @type_checker
#     def __rsub__(self, other: Vector):
#         return Vector(other.x - self.x, other.y - self.y)

#     def __str__(self) -> str:
#         return f"({self.x}; {self.y})"


# v1 = Vector(1, 4)
# v2 = Vector(4, 4)

# some_list_dict: list[dict] =\
# [
#     {
#         "age": 12,
#         "name": "Boris"
#     },
#     {
#         "age": 7,
#         "name": "Alex"
#     }
# ]
# # a = {"some": "thing"}.{"new": "value"}
# list_of_dicts_updated = list(map(lambda d: {**d, "height": 200}, some_list_dict))
# # some_list_dict = list(map(lambda el: el["new_field"]=  "new_value"}),\
# #                           some_list_dict))

# print(list_of_dicts_updated)


a = '[[2,1,3],[6,5,4],[7,8,9]]'
print(f"{a.replace("[", "{").replace("]", "}")}")
